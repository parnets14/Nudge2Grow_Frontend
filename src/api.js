import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || "https://nudgebackend.onrender.com/uploads";

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const get    = (url, params) => client.get(url, { params }).then((r) => r.data);
const post   = (url, body)   => client.post(url, body).then((r) => r.data);
const put    = (url, body)   => client.put(url, body).then((r) => r.data);
const del    = (url)         => client.delete(url).then((r) => r.data);

export const api = {
  // Auth
  login: (email, password) => post("/admin/login", { email, password }),

  // User Management
  users: {
    getAll: () => get("/admin/parents"),
    remove: (id) => del(`/admin/parents/${id}`),
  },
  grades: {
    getAll: ()       => get("/grade"),
    create: (body)   => post("/grade", body),
    update: (id, b)  => put(`/grade/${id}`, b),
    remove: (id)     => del(`/grade/${id}`),
  },
  educationalBoards: {
    getAll: ()       => get("/educational-board"),
    create: (body)   => post("/educational-board", body),
    update: (id, b)  => put(`/educational-board/${id}`, b),
    remove: (id)     => del(`/educational-board/${id}`),
  },
  avatars: {
    getAll: ()       => get("/avatars"),
    create: (body)   => post("/avatars", body),
    update: (id, b)  => put(`/avatars/${id}`, b),
    remove: (id)     => del(`/avatars/${id}`),
  },
  introSlides: {
    getAll: ()       => get("/intro-slides"),
    create: (body)   => post("/intro-slides", body),
    update: (id, b)  => put(`/intro-slides/${id}`, b),
    remove: (id)     => del(`/intro-slides/${id}`),
  },
  customizeLearning: {
    getAll: ()       => get("/customize-learning"),
    create: (body)   => post("/customize-learning", body),
    update: (id, b)  => put(`/customize-learning/${id}`, b),
    remove: (id)     => del(`/customize-learning/${id}`),
  },

  // Learning Subjects
  subjects: {
    getAll: ()       => get("/learning-subjects/subjects"),
    create: (body)   => post("/learning-subjects/subjects", body),
    update: (id, b)  => put(`/learning-subjects/subjects/${id}`, b),
    remove: (id)     => del(`/learning-subjects/subjects/${id}`),
  },

  // Content Sets (Flashcards + Q&A + Prompts grouped by topic)
  contentSets: {
    getAll: ()       => get("/content-sets"),
    create: (body)   => post("/content-sets", body),
    update: (id, b)  => put(`/content-sets/${id}`, b),
    remove: (id)     => del(`/content-sets/${id}`),
  },

  // Learn Details
  learnDetails: {
    getAll: ()       => get("/learn-details"),
    create: (body)   => post("/learn-details", body),
    update: (id, b)  => put(`/learn-details/${id}`, b),
    remove: (id)     => del(`/learn-details/${id}`),
  },

  // Topics
  topics: {
    getAll: ()       => get("/topics"),
    create: (body)   => post("/topics", body),
    update: (id, b)  => put(`/topics/${id}`, b),
    remove: (id)     => del(`/topics/${id}`),
  },

  // Flashcards
  flashcards: {
    getAll: ()       => get("/flashcards"),
    create: (body)   => post("/flashcards", body),
    update: (id, b)  => put(`/flashcards/${id}`, b),
    remove: (id)     => del(`/flashcards/${id}`),
  },

  // Q&A
  qa: {
    getAll: ()       => get("/qa"),
    create: (body)   => post("/qa", body),
    update: (id, b)  => put(`/qa/${id}`, b),
    remove: (id)     => del(`/qa/${id}`),
  },

  // Prompts
  prompts: {
    getAll: ()       => get("/prompts"),
    create: (body)   => post("/prompts", body),
    update: (id, b)  => put(`/prompts/${id}`, b),
    remove: (id)     => del(`/prompts/${id}`),
  },

  // Home Management
  didYouKnow: {
    getAll: ()       => get("/did-you-know"),
    create: (body)   => post("/did-you-know", body),
    update: (id, b)  => put(`/did-you-know/${id}`, b),
    remove: (id)     => del(`/did-you-know/${id}`),
  },
  riddles: {
    getAll: ()       => get("/riddles"),
    create: (body)   => post("/riddles", body),
    update: (id, b)  => put(`/riddles/${id}`, b),
    remove: (id)     => del(`/riddles/${id}`),
  },
  parentingInsights: {
    getAll: ()       => get("/parenting-insights"),
    create: (body)   => post("/parenting-insights", body),
    update: (id, b)  => put(`/parenting-insights/${id}`, b),
    remove: (id)     => del(`/parenting-insights/${id}`),
  },
  phaseCards: {
    getAll: ()       => get("/phase-cards"),
    create: (body)   => post("/phase-cards", body),
    update: (id, b)  => put(`/phase-cards/${id}`, b),
    remove: (id)     => del(`/phase-cards/${id}`),
  },

  // Subscription
  plans: {
    getAll: ()       => get("/subscription/plans"),
    create: (body)   => post("/subscription/plans", body),
    update: (id, b)  => put(`/subscription/plans/${id}`, b),
    remove: (id)     => del(`/subscription/plans/${id}`),
  },
  testimonials: {
    getAll: ()       => get("/subscription/testimonials"),
    create: (body)   => post("/subscription/testimonials", body),
    update: (id, b)  => put(`/subscription/testimonials/${id}`, b),
    remove: (id)     => del(`/subscription/testimonials/${id}`),
  },
  faqs: {
    getAll: ()       => get("/subscription/faqs"),
    create: (body)   => post("/subscription/faqs", body),
    update: (id, b)  => put(`/subscription/faqs/${id}`, b),
    remove: (id)     => del(`/subscription/faqs/${id}`),
  },
  helpFaqs: {
    getAll: ()       => get("/help-faqs"),
    create: (body)   => post("/help-faqs", body),
    update: (id, b)  => put(`/help-faqs/${id}`, b),
    remove: (id)     => del(`/help-faqs/${id}`),
  },
  contactMessages: {
    getAll: ()       => get("/contact-messages"),
    markRead: (id)   => put(`/contact-messages/${id}/read`, {}),
    remove: (id)     => del(`/contact-messages/${id}`),
  },
  supportInfo: {
    get:    ()       => get("/support-info"),
    update: (body)   => put("/support-info", body),
  },
  customerRatings: {
    getAll: ()       => get("/customer-ratings"),
    remove: (id)     => del(`/customer-ratings/${id}`),
  },
};