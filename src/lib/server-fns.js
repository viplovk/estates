const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CATEGORIES, COMMERCIAL_CATEGORIES, SITE } from "@/lib/site";

const PAGE_SIZE = 9;

/* ------------------------------------------------------------------ helpers */

function buildQuery(f = {}) {
  const q = { published: true };
  if (f.transaction) q.transaction = f.transaction;
  if (f.category) q.category = f.category;
  if (f.bucket === "commercial") q.category = { $in: COMMERCIAL_CATEGORIES };
  if (f.bucket === "residential") q.category = { $nin: COMMERCIAL_CATEGORIES };
  if (f.locality) q.locality = f.locality;
  if (f.minPrice || f.maxPrice) {
    q.price = {};
    if (f.minPrice) q.price.$gte = Number(f.minPrice);
    if (f.maxPrice) q.price.$lte = Number(f.maxPrice);
  }
  if (f.bedrooms) q.bedrooms = { $gte: Number(f.bedrooms) };
  if (f.bathrooms) q.bathrooms = { $gte: Number(f.bathrooms) };
  if (f.minArea || f.maxArea) {
    q.area = {};
    if (f.minArea) q.area.$gte = Number(f.minArea);
    if (f.maxArea) q.area.$lte = Number(f.maxArea);
  }
  if (f.furnishing) q.furnishing = f.furnishing;
  if (f.parking) q.parking = f.parking;
  if (f.floor) q.floor = f.floor;
  if (f.availability) q.availability = f.availability;
  return q;
}

function sortValue(sort) {
  switch (sort) {
    case "price-asc":
      return "price";
    case "price-desc":
      return "-price";
    case "area-desc":
      return "-area";
    default:
      return "-created_date";
  }
}

async function assertAdmin(base44) {
  let me = null;
  try {
    me = await db.auth.me();
  } catch {
    me = null;
  }
  if (!me || me.role !== "admin") {
    const err = new Error("Not authorised");
    err.status = 403;
    throw err;
  }
  return me;
}

function notifyAgency(base44, subject, html) {
  return db.asServiceRole.integrations.Core.SendEmail({
    to: SITE.email,
    subject,
    html,
    text: html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    category: "transactional",
  });
}

function leadEmailHtml(lead) {
  const rows = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email || "—"],
    ["Enquiry type", lead.enquiry_type],
    ["Property", lead.property_title || "—"],
    ["Property URL", lead.property_slug ? `/property/${lead.property_slug}` : "—"],
    ["Preferred viewing", [lead.viewing_date, lead.viewing_time].filter(Boolean).join(" · ") || "—"],
    ["Source", lead.source || "—"],
    ["Message", lead.message || "—"],
  ];
  return `<div style="font-family:Georgia,serif;color:#242421">
    <h2 style="font-weight:400">New enquiry — East Delhi Realty</h2>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 16px 6px 0;color:#858178">${k}</td><td style="padding:6px 0">${String(
              v ?? "",
            )}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:Arial;font-size:13px;color:#858178;margin-top:18px">
      Manage this lead in the admin dashboard: /admin/leads
    </p>
  </div>`;
}

/* ------------------------------------------------------------- public reads */

export const listFeaturedProperties = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const base44 = context.getBase44();
    const featured = await db.entities.Properties.filter(
      { published: true, featured: true },
      { sort: "-created_date", limit: 6 },
    );
    let items = featured.items || [];
    if (items.length < 6) {
      const latest = await db.entities.Properties.filter(
        { published: true },
        { sort: "-created_date", limit: 6 },
      );
      const seen = new Set(items.map((p) => p.id));
      items = [...items, ...(latest.items || []).filter((p) => !seen.has(p.id))].slice(0, 6);
    }
    return items;
  },
);

export const searchProperties = createServerFn({ method: "GET" })
  .validator((input) => input || {})
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const query = buildQuery(data);
    const [page, total] = await Promise.all([
      db.entities.Properties.filter(query, {
        sort: sortValue(data.sort),
        limit: PAGE_SIZE,
        ...(data.cursor ? { cursor: data.cursor } : {}),
      }),
      db.entities.Properties.count(query),
    ]);
    return {
      items: page.items || [],
      next_cursor: page.next_cursor || null,
      has_more: !!page.has_more,
      total,
    };
  });

export const getProperty = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const page = await db.entities.Properties.filter(
      { slug: data.slug, published: true },
      { limit: 1 },
    );
    const property = page.items?.[0];
    return property || null;
  });

export const getSimilarProperties = createServerFn({ method: "GET" })
  .validator(
    z.object({
      id: z.string(),
      transaction: z.string().optional(),
      locality: z.string().optional(),
      category: z.string().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const base = { published: true, ...(data.transaction ? { transaction: data.transaction } : {}) };
    const [byLocality, byCategory] = await Promise.all([
      data.locality
        ? db.entities.Properties.filter({ ...base, locality: data.locality }, { limit: 6 })
        : Promise.resolve({ items: [] }),
      data.category
        ? db.entities.Properties.filter({ ...base, category: data.category }, { limit: 6 })
        : Promise.resolve({ items: [] }),
    ]);
    const seen = new Set([data.id]);
    const out = [];
    for (const p of [...(byLocality.items || []), ...(byCategory.items || [])]) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
      if (out.length === 3) break;
    }
    return out;
  });

/* ------------------------------------------------------------ public writes */

const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(18)
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(1200).optional().or(z.literal("")),
  enquiry_type: z.enum(["property_enquiry", "viewing_request", "contact"]),
  source: z.string().max(40).optional(),
  property_id: z.string().max(60).optional().or(z.literal("")),
  property_title: z.string().max(160).optional().or(z.literal("")),
  property_slug: z.string().max(160).optional().or(z.literal("")),
  viewing_date: z.string().max(30).optional().or(z.literal("")),
  viewing_time: z.string().max(20).optional().or(z.literal("")),
  guests: z.string().max(10).optional().or(z.literal("")),
});

export const createLead = createServerFn({ method: "POST" })
  .validator(leadSchema)
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const service = db.asServiceRole;

    // Repeat-click protection: ignore the same phone + property within 2 minutes.
    const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const recent = await service.entities.Leads.filter(
      {
        phone: data.phone,
        ...(data.property_id ? { property_id: data.property_id } : {}),
        created_date: { $gte: since },
      },
      { limit: 1 },
    ).catch(() => ({ items: [] }));
    if ((recent.items || []).length > 0) {
      return { ok: true, duplicate: true, emailed: false };
    }

    const lead = await service.entities.Leads.create({
      ...data,
      email: data.email || "",
      message: data.message || "",
      source: data.source || "website",
      status: "New",
    });

    let emailed = false;
    try {
      await notifyAgency(base44, "New Property Enquiry – East Delhi Realty", leadEmailHtml(lead));
      emailed = true;
    } catch {
      emailed = false;
    }

    return { ok: true, duplicate: false, emailed, id: lead.id };
  });

const submissionSchema = z.object({
  owner_name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(18)
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  address: z.string().trim().min(3).max(240),
  locality: z.string().trim().min(2).max(80),
  category: z.enum(CATEGORIES),
  intent: z.enum(["sell", "rent"]),
  expected_price: z.string().trim().max(30).optional().or(z.literal("")),
  area: z.string().trim().max(20).optional().or(z.literal("")),
  bedrooms: z.string().trim().max(10).optional().or(z.literal("")),
  bathrooms: z.string().trim().max(10).optional().or(z.literal("")),
  furnishing: z.string().trim().max(30).optional().or(z.literal("")),
  description: z.string().trim().min(10).max(2000),
  photos: z.array(z.string().max(500)).max(10).optional(),
  extra_info: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const createOwnerSubmission = createServerFn({ method: "POST" })
  .validator(submissionSchema)
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const service = db.asServiceRole;
    const submission = await service.entities.OwnerSubmissions.create({
      ...data,
      email: data.email || "",
      photos: data.photos || [],
      status: "pending",
    });

    const lead = await service.entities.Leads.create({
      name: data.owner_name,
      phone: data.phone,
      email: data.email || "",
      message: data.description,
      enquiry_type: "owner_submission",
      source: "list_property",
      property_title: `${data.category} — ${data.locality}`,
      status: "New",
    }).catch(() => null);

    let emailed = false;
    try {
      await notifyAgency(
        base44,
        "New Property Enquiry – East Delhi Realty",
        leadEmailHtml({
          ...(lead || {}),
          name: data.owner_name,
          phone: data.phone,
          email: data.email,
          enquiry_type: "owner_submission",
          property_title: `${data.category} — ${data.locality}`,
          source: "list_property",
          message: data.description,
        }),
      );
      emailed = true;
    } catch {
      emailed = false;
    }

    return { ok: true, id: submission.id, emailed };
  });

/* ------------------------------------------------------------------- admin */

export const adminOverview = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const base44 = context.getBase44();
  await assertAdmin(base44);
  const [
    totalProperties,
    published,
    pendingSubmissions,
    totalLeads,
    newLeads,
    scheduledViewings,
  ] = await Promise.all([
    db.entities.Properties.count({}),
    db.entities.Properties.count({ published: true }),
    db.entities.OwnerSubmissions.count({ status: "pending" }),
    db.entities.Leads.count({}),
    db.entities.Leads.count({ status: "New" }),
    db.entities.Leads.count({ status: "Visit Scheduled" }),
  ]);
  return {
    totalProperties,
    published,
    unpublished: totalProperties - published,
    pendingSubmissions,
    totalLeads,
    newLeads,
    scheduledViewings,
  };
});

export const adminListProperties = createServerFn({ method: "GET" })
  .validator((input) => input || {})
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    await assertAdmin(base44);
    const query = {};
    if (data.published === "true") query.published = true;
    if (data.published === "false") query.published = false;
    const page = await db.entities.Properties.list({
      sort: "-created_date",
      limit: 100,
    });
    let items = page.items || (Array.isArray(page) ? page : []);
    if (query.published !== undefined) {
      items = items.filter((p) => !!p.published === query.published);
    }
    return items;
  });

export const adminGetProperty = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    await assertAdmin(base44);
    try {
      return await db.entities.Properties.get(data.id);
    } catch {
      return null;
    }
  });

export const adminSaveProperty = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().optional(), data: z.record(z.string(), z.any()) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    await assertAdmin(base44);
    const payload = { ...data.data };
    delete payload.id;
    delete payload.created_date;
    delete payload.updated_date;
    delete payload.created_by_id;

    if (data.id) {
      return db.entities.Properties.update(data.id, payload);
    }
    return db.entities.Properties.create(payload);
  });

export const adminDeleteProperty = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    await assertAdmin(base44);
    await db.entities.Properties.delete(data.id);
    return { ok: true };
  });

export const adminListLeads = createServerFn({ method: "GET" })
  .validator((input) => input || {})
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    await assertAdmin(base44);
    const query = {};
    if (data.status && data.status !== "all") query.status = data.status;
    if (data.search) {
      query.$or = [
        { name: { $regex: data.search, $options: "i" } },
        { phone: { $regex: data.search, $options: "i" } },
      ];
    }
    const page = await db.entities.Leads.filter(query, {
      sort: "-created_date",
      limit: 200,
    });
    return page.items || [];
  });

export const adminUpdateLead = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), patch: z.record(z.string(), z.any()) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    await assertAdmin(base44);
    const allowed = {};
    if (data.patch.status !== undefined) allowed.status = data.patch.status;
    if (data.patch.notes !== undefined) allowed.notes = String(data.patch.notes).slice(0, 2000);
    return db.entities.Leads.update(data.id, allowed);
  });

export const adminListSubmissions = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    const base44 = context.getBase44();
    await assertAdmin(base44);
    const page = await db.entities.OwnerSubmissions.list({
      sort: "-created_date",
      limit: 200,
    });
    return page.items || [];
  },
);

export const adminUpdateSubmission = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
      status: z.enum(["pending", "approved", "rejected"]).optional(),
      admin_notes: z.string().max(2000).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    await assertAdmin(base44);
    const patch = {};
    if (data.status) patch.status = data.status;
    if (data.admin_notes !== undefined) patch.admin_notes = data.admin_notes;
    return db.entities.OwnerSubmissions.update(data.id, patch);
  });

export const adminConvertSubmission = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    await assertAdmin(base44);
    const submission = await db.entities.OwnerSubmissions.get(data.id);

    const slugBase = `${submission.bedrooms ? `${submission.bedrooms}bhk-` : ""}${submission.category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-${submission.locality
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`;
    const existing = await db.entities.Properties.filter(
      { slug: { $regex: `^${slugBase}` } },
      { limit: 50 },
    );
    const slug = `${slugBase}-${(existing.items?.length || 0) + 1}`;

    const property = await db.entities.Properties.create({
      title: `${submission.bedrooms ? `${submission.bedrooms} BHK ` : ""}${submission.category} in ${submission.locality}`,
      slug,
      description: submission.description,
      locality: submission.locality,
      address: submission.address,
      show_exact_address: false,
      category: submission.category,
      transaction: submission.intent === "rent" ? "rent" : "buy",
      price: Number(String(submission.expected_price || "").replace(/[^0-9]/g, "")) || 0,
      bedrooms: Number(submission.bedrooms) || 0,
      bathrooms: Number(submission.bathrooms) || 0,
      area: Number(String(submission.area || "").replace(/[^0-9]/g, "")) || 0,
      furnishing: submission.furnishing || "Unfurnished",
      availability: "Available Now",
      features: [],
      images: [],
      cover_image: "",
      featured: false,
      published: false,
      source_submission_id: submission.id,
    });

    await db.entities.OwnerSubmissions.update(submission.id, {
      status: "approved",
      converted_property_id: property.id,
    });

    return { ok: true, propertyId: property.id, slug };
  });