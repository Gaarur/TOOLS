import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

function getTableName(table: any): string {
  if (typeof table === "string") return table;
  if (!table) return "unknown";
  if (table[Symbol.for("drizzle:Name")]) return table[Symbol.for("drizzle:Name")];
  if (table._ && table._.name) return table._.name;
  if (table._ && table._.config && table._.config.name) return table._.config.name;
  if (table.name && typeof table.name === "string") return table.name;
  for (const [key, val] of Object.entries(schema)) {
    if (val === table) return key;
  }
  return "unknown";
}

function matchCondition(row: any, condition: any): boolean {
  if (!condition) return true;
  
  const colNames: string[] = [];
  const values: any[] = [];

  function traverse(obj: any, depth = 0) {
    if (depth > 10 || obj === null || obj === undefined) return;
    if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
      if (typeof obj === "string" && obj in row && !colNames.includes(obj)) {
        colNames.push(obj);
      } else if (obj !== "eq" && obj !== "ne" && obj !== "and" && obj !== "or" && obj !== "sql") {
        values.push(obj);
      }
      return;
    }
    if (typeof obj === "object") {
      if (obj.name && typeof obj.name === "string" && obj.name in row) {
        colNames.push(obj.name);
      } else if (obj._ && obj._.name && typeof obj._.name === "string" && obj._.name in row) {
        colNames.push(obj._.name);
      } else if (obj.config && obj.config.name && typeof obj.config.name === "string" && obj.config.name in row) {
        colNames.push(obj.config.name);
      }
      for (const key of Object.keys(obj)) {
        if (key === "table" || key === "_" || key === "dataType" || key === "columnType") continue;
        traverse(obj[key], depth + 1);
      }
    }
  }

  traverse(condition);

  if (colNames.length > 0 && values.length > 0) {
    const colName = colNames[0];
    const val = values[0];
    return row[colName] == val || String(row[colName]) === String(val);
  }

  return true;
}

function createMockDb() {
  console.log("ℹ️ [Local Preview] DATABASE_URL is not set. Using in-memory mock database with rich sample data.");

  const inMemoryData: Record<string, any[]> = {
    heroSection: [{
      id: 1,
      heading: "Engineered for Precision. Built for Performance.",
      subheading: "A precision engineering partner delivering excellence in plastic injection moulds, rubber moulds, and precision fixtures for demanding industrial applications.",
      primaryBtnText: "Get Started",
      primaryBtnUrl: "#contact",
      secondaryBtnText: "View Details",
      secondaryBtnUrl: "#services",
      backgroundImageUrl: null,
      heroImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663040908526/T5nUZGsYwviFHSbhKoH2Ra/hero-machinery-outline-D58gBzYTz8D6r7LhsGbZmk.webp",
      visible: 1,
      updatedAt: new Date(),
    }],
    aboutSection: [{
      id: 1,
      title: "ABOUT US & TIMELINE",
      subtitle: "With 25+ years experience",
      description: "A clean sector with blending of 25+ years experience milestone",
      mission: "To deliver unmatched quality in mould manufacturing and precision components through engineering excellence and continuous innovation.",
      vision: "To be a global leader in precision engineering solutions, recognized for technical expertise, customer service, and absolute accuracy.",
      imageUrl: null,
      ctaText: "Learn More",
      ctaUrl: "#about",
      updatedAt: new Date(),
    }],
    seoSettings: [{
      id: 1,
      title: "OM TECHNO TOOLS - Precision Engineering",
      metaDescription: "High-precision moulds engineered for mass production of plastic and rubber components.",
      keywords: "moulds, plastic injection, precision engineering, rubber moulds",
      ogImage: null,
      twitterCard: "summary_large_image",
      robots: "index, follow",
      canonicalUrl: null,
      updatedAt: new Date(),
    }],
    generalSettings: [{
      id: 1,
      companyName: "OM TECHNO TOOLS",
      tagline: "Engineered for Precision. Built for Performance.",
      description: "Precision engineering solutions for manufacturing excellence",
      address: "Plot No. 393 & 394, Udyog Kendra 2, Ecotech 3, Greater Noida, Pincode: 201306",
      phone1: "+91 9289304917",
      phone2: "+91 9625696886",
      email1: "om.techtools1971@gmail.com",
      email2: "omtt.design@gmail.com",
      logoUrl: null,
      faviconUrl: null,
      googleMapsEmbed: null,
      socialLinkedin: null,
      socialTwitter: null,
      socialGithub: null,
      footerText: "Precision engineering partner delivering excellence",
      copyrightText: "© 2026 OM TECHNO TOOLS. All rights reserved.",
      updatedAt: new Date(),
    }],
    services: [
      {
        id: 1,
        title: "Plastic Injection Moulds",
        shortDescription: "High-precision moulds engineered for mass production of plastic components with exceptional tolerance.",
        longDescription: "Our plastic injection moulds are designed and manufactured using state-of-the-art CNC and EDM machinery. We specialize in high-volume, multi-cavity moulds that deliver consistent part quality, reduced cycle times, and extended mould life.",
        icon: "Settings",
        displayOrder: 1,
        status: "active",
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663040908526/T5nUZGsYwviFHSbhKoH2Ra/plastic-injection-outline-JkkHcBU4KWipJ5e4bnWEM5.webp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "Rubber & Elastomer Moulds",
        shortDescription: "Specialized compression and injection moulds for rubber seals, gaskets, and vibration isolators.",
        longDescription: "We engineer robust rubber moulds tailored for high-pressure compression and transfer moulding. Our tooling ensures precise flash control, optimal curing characteristics, and superior dimensional stability for critical sealing applications.",
        icon: "Settings",
        displayOrder: 2,
        status: "active",
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663040908526/T5nUZGsYwviFHSbhKoH2Ra/rubber-mould-outline-7hfenhy8NPZ7pMpwkUhvMn.webp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        title: "Precision Jigs & Fixtures",
        shortDescription: "Custom machining fixtures, welding jigs, and inspection gauges for automated production lines.",
        longDescription: "Our custom-designed jigs and fixtures enhance manufacturing accuracy and repeatability. Built from high-grade hardened tool steels, they feature quick-release mechanisms and modular locating pins for rapid part loading and zero-defect assembly.",
        icon: "Settings",
        displayOrder: 3,
        status: "active",
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663040908526/T5nUZGsYwviFHSbhKoH2Ra/jigs-fixtures-outline-DdrPVSb6uDFyBKvFp3U3kD.webp",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    team: [
      {
        id: 1,
        name: "Rajesh Sharma",
        role: "Founder & Managing Director",
        bio: "25+ years of pioneering experience in tool room operations and precision mould engineering.",
        photoUrl: null,
        linkedin: "#",
        twitter: null,
        github: null,
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Amit Kumar",
        role: "Head of Design & CAD/CAM",
        bio: "Specialist in multi-cavity mould design, flow simulation, and CNC tool path optimization.",
        photoUrl: null,
        linkedin: "#",
        twitter: null,
        github: null,
        displayOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    gallery: [
      {
        id: 1,
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663040908526/T5nUZGsYwviFHSbhKoH2Ra/hero-machinery-outline-D58gBzYTz8D6r7LhsGbZmk.webp",
        displayOrder: 1,
        caption: "High Precision CNC Milling Center",
        createdAt: new Date(),
      },
      {
        id: 2,
        imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663040908526/T5nUZGsYwviFHSbhKoH2Ra/plastic-injection-outline-JkkHcBU4KWipJ5e4bnWEM5.webp",
        displayOrder: 2,
        caption: "Multi-Cavity Injection Mould Assembly",
        createdAt: new Date(),
      }
    ],
    testimonials: [
      {
        id: 1,
        clientName: "Vikram Mehta",
        company: "AutoComponents India Pvt Ltd",
        photoUrl: null,
        review: "OM TECHNO TOOLS delivered our complex automotive dashboard mould 2 weeks ahead of schedule. The surface finish and dimensional precision were flawless.",
        rating: 5,
        visible: 1,
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        clientName: "Suresh Gupta",
        company: "Polymer Solutions LLP",
        photoUrl: null,
        review: "Their rubber compression moulds have significantly reduced our flash rates and improved our production cycle efficiency by 20%. Exceptional tooling partner!",
        rating: 5,
        visible: 1,
        displayOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    faqs: [
      {
        id: 1,
        question: "What is your typical lead time for mould manufacturing?",
        answer: "Depending on the complexity and cavity count, typical lead times range from 3 to 6 weeks. We also offer expedited prototyping services for urgent requirements.",
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        question: "What tolerances can OM TECHNO TOOLS achieve?",
        answer: "Our advanced CNC and EDM machining centers routinely achieve precision tolerances down to ±0.005mm (5 microns), ensuring perfect mating of core and cavity components.",
        displayOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        question: "Do you provide mould maintenance and repair services?",
        answer: "Yes, we offer comprehensive tool room services including mould refurbishment, engineering modifications, polishing, and preventive maintenance.",
        displayOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    blogPosts: [
      {
        id: 1,
        title: "The Future of High-Precision Injection Moulding in 2026",
        slug: "future-of-high-precision-injection-moulding",
        excerpt: "Explore how conformal cooling and advanced CAD/CAM simulation are revolutionizing cycle times and component quality.",
        content: "High-precision plastic injection moulding is experiencing a transformative shift driven by advanced manufacturing technologies. In modern tool rooms, the adoption of conformal cooling channels—enabled by metal additive manufacturing—has drastically reduced cycle times while minimizing part warpage.\n\nFurthermore, predictive CAD/CAM flow simulations now allow engineers to identify potential weld lines, air traps, and shrinkage before cutting a single block of steel. At OM TECHNO TOOLS, we continuously invest in cutting-edge multi-axis machining and EDM technologies to deliver tooling that meets the rigorous demands of automotive, aerospace, and medical device manufacturing.",
        coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663040908526/T5nUZGsYwviFHSbhKoH2Ra/hero-machinery-outline-D58gBzYTz8D6r7LhsGbZmk.webp",
        author: "Rajesh Sharma",
        published: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "Selecting the Right Tool Steel for Long-Life Moulds",
        slug: "selecting-tool-steel-for-long-life-moulds",
        excerpt: "A technical guide on choosing between P20, H13, and stainless steel grades for optimal mould wear resistance.",
        content: "When designing high-volume injection and rubber moulds, material selection for core and cavity inserts is paramount. Selecting the appropriate grade of tool steel directly impacts thermal conductivity, polishability, and resistance to abrasive or corrosive polymers.\n\nFor general-purpose prototyping and medium production runs, pre-hardened P20 steel offers excellent machinability and stability. However, for abrasive glass-filled resins or high-pressure rubber moulding, premium hardened grades such as H13 or Strix stainless steel provide superior wear resistance and thermal fatigue strength. Our engineering team collaborates closely with clients to select the optimal metallurgy for their specific production volume and budget.",
        coverImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663040908526/T5nUZGsYwviFHSbhKoH2Ra/plastic-injection-outline-JkkHcBU4KWipJ5e4bnWEM5.webp",
        author: "Amit Kumar",
        published: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    contactSubmissions: [],
    users: [
      {
        id: 1,
        openId: "admin_open_id",
        name: "Administrator",
        email: "om.techtools1971@gmail.com",
        loginMethod: "credentials",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    ]
  };

  return {
    select(fields?: any) {
      return {
        from(table: any) {
          const tableName = getTableName(table);
          let condition: any = null;
          let orderFn: any = null;
          let limitVal: number | null = null;

          const builder = {
            where(cond: any) {
              condition = cond;
              return builder;
            },
            orderBy(...args: any[]) {
              orderFn = args;
              return builder;
            },
            limit(n: number) {
              limitVal = n;
              return builder;
            },
            then(resolve: (val: any) => void, reject?: (err: any) => void) {
              try {
                const rows = inMemoryData[tableName] || [];
                let filtered = rows.filter(row => matchCondition(row, condition));
                
                if (orderFn) {
                  filtered = [...filtered].sort((a, b) => {
                    if ("displayOrder" in a && "displayOrder" in b) {
                      return (a.displayOrder || 0) - (b.displayOrder || 0);
                    }
                    if ("createdAt" in a && "createdAt" in b && a.createdAt && b.createdAt) {
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                    return (b.id || 0) - (a.id || 0);
                  });
                }

                if (limitVal !== null && limitVal !== undefined) {
                  filtered = filtered.slice(0, limitVal);
                }

                if (fields && typeof fields === "object" && "count" in fields) {
                  resolve([{ count: filtered.length }]);
                } else {
                  resolve(filtered);
                }
              } catch (err) {
                if (reject) reject(err);
              }
            }
          };
          return builder;
        }
      };
    },
    insert(table: any) {
      const tableName = getTableName(table);
      return {
        values(valOrArray: any) {
          return {
            then(resolve: (val: any) => void, reject?: (err: any) => void) {
              try {
                const rows = inMemoryData[tableName] || [];
                const items = Array.isArray(valOrArray) ? valOrArray : [valOrArray];
                for (const item of items) {
                  const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id || 0)) + 1 : 1;
                  const newRow = {
                    id: newId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    ...item
                  };
                  rows.push(newRow);
                }
                if (!inMemoryData[tableName]) {
                  inMemoryData[tableName] = rows;
                }
                resolve({ success: true, insertId: rows[rows.length - 1]?.id });
              } catch (err) {
                if (reject) reject(err);
              }
            }
          };
        }
      };
    },
    update(table: any) {
      const tableName = getTableName(table);
      let patch: any = {};
      return {
        set(data: any) {
          patch = data;
          const builder = {
            where(condition: any) {
              return {
                then(resolve: (val: any) => void, reject?: (err: any) => void) {
                  try {
                    const rows = inMemoryData[tableName] || [];
                    for (let i = 0; i < rows.length; i++) {
                      if (matchCondition(rows[i], condition)) {
                        rows[i] = { ...rows[i], ...patch, updatedAt: new Date() };
                      }
                    }
                    resolve({ success: true });
                  } catch (err) {
                    if (reject) reject(err);
                  }
                }
              };
            },
            then(resolve: (val: any) => void, reject?: (err: any) => void) {
              try {
                const rows = inMemoryData[tableName] || [];
                for (let i = 0; i < rows.length; i++) {
                  rows[i] = { ...rows[i], ...patch, updatedAt: new Date() };
                }
                resolve({ success: true });
              } catch (err) {
                if (reject) reject(err);
              }
            }
          };
          return builder;
        }
      };
    },
    delete(table: any) {
      const tableName = getTableName(table);
      return {
        where(condition: any) {
          return {
            then(resolve: (val: any) => void, reject?: (err: any) => void) {
              try {
                const rows = inMemoryData[tableName] || [];
                inMemoryData[tableName] = rows.filter(row => !matchCondition(row, condition));
                resolve({ success: true });
              } catch (err) {
                if (reject) reject(err);
              }
            }
          };
        }
      };
    }
  } as any;
}

const queryClient = postgres(databaseUrl || "postgresql://postgres:password@localhost:5432/omtt");
const realDb = drizzle(queryClient, { schema });

let dbInstance: any;

if (!databaseUrl || databaseUrl.trim() === "") {
  dbInstance = createMockDb();
} else {
  dbInstance = realDb;
}

export const db: typeof realDb = dbInstance as typeof realDb;
