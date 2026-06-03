export type TenantType = 'repstanding' | 'perception_mirror';

export interface TenantConfig {
  title: string;
  tagline: string;
  description: string;
  companyName: string;
  logo: string;
  favicon: string;
  supportEmail: string;
  senderEmail: string;
  vocabulary: {
    heroTitle: string;
    heroSubtitle: string;
    ctaButton: string;
    auditTerm: string;
    raterTerm: string;
    goalTerm: string;
    blindspotTerm: string;
  };
}

export const tenantConfigs: Record<TenantType, TenantConfig> = {
  repstanding: {
    title: "RepStanding",
    tagline: "The 360-Degree Professional Reputation Audit",
    description: "Gather anonymous performance feedback from your colleagues, clients, and managers to discover critical blind spots.",
    companyName: "RepStanding Ltd",
    logo: "/brands/repstanding/logo.svg",
    favicon: "/brands/repstanding/favicon.ico",
    supportEmail: "support@repstanding.com",
    senderEmail: "audit@repstanding.com",
    vocabulary: {
      heroTitle: "The Shortcut to Strategic Self Improvement",
      heroSubtitle: "Gain the deep, anonymous insights you need to grow professionally. Gather honest performance feedback from colleagues, clients, and managers.",
      ctaButton: "Start Your Audit",
      auditTerm: "360 Performance Audit",
      raterTerm: "Rater Network",
      goalTerm: "KPI Alignment",
      blindspotTerm: "Critical Blindspots"
    }
  },
  perception_mirror: {
    title: "The Perception Mirror",
    tagline: "Align Your Growth & Uncover Hidden Shadows",
    description: "Gather honest, anonymous reflections from your inner circle of friends, family, and mentors to reveal your true self.",
    companyName: "The Perception Mirror",
    logo: "/brands/perception_mirror/logo.svg",
    favicon: "/brands/perception_mirror/favicon.ico",
    supportEmail: "hello@theperceptionmirror.com",
    senderEmail: "hello@theperceptionmirror.com",
    vocabulary: {
      heroTitle: "Reveal Your True Self, Align Your Growth",
      heroSubtitle: "Uncover how you are experienced by those who know you best. Gather gentle, candid reflections from your inner circle of friends, family, and mentors.",
      ctaButton: "Begin Your Reflection",
      auditTerm: "The Perception Mirror",
      raterTerm: "Inner Circle",
      goalTerm: "Growth Alignment",
      blindspotTerm: "Hidden Blocks & Shadows"
    }
  }
};

export function getTenantConfig(tenant: TenantType): TenantConfig {
  return tenantConfigs[tenant];
}

export interface GoalCategoryConfig {
  categoryName: string;
  description: string;
  tagBank: string[];
  placeholderText: string;
}

export const GOAL_CONFIG_MAP: Record<string, GoalCategoryConfig[]> = {
  career_progression: [
    {
      categoryName: "Strategic Impact",
      description: "How effectively they drive long-term business outcomes and prioritize critical initiatives.",
      tagBank: ["Visionary", "Data-Driven", "Short-Sighted", "Results-Oriented", "Indecisive", "Proactive", "Action-Biased"],
      placeholderText: "Can you describe a specific time they demonstrated strategic impact?"
    },
    {
      categoryName: "Executive Influence",
      description: "Their ability to communicate credibility, persuade stakeholders, and lead cross-functional groups.",
      tagBank: ["Persuasive", "Articulate", "Quiet", "Overbearing", "Credible", "Commanding Presence", "Respected"],
      placeholderText: "Give an example of how they managed a difficult stakeholder or meeting."
    }
  ],
  leadership_mastery: [
    {
      categoryName: "Collaborative Authority",
      description: "How they lead teams, build alignment, and make decisions without micromanaging.",
      tagBank: ["Empowering", "Inclusive", "Micromanaging", "Decisive", "Detached", "Supportive", "Accountable"],
      placeholderText: "How do they handle decision-making or delegation in a group?"
    },
    {
      categoryName: "Psychological Safety",
      description: "Their ability to create trust, foster open communication, and handle tension constructively.",
      tagBank: ["Trustworthy", "Encouraging", "Punitive", "Patient", "Unpredictable", "Receptive to Input", "Defensive"],
      placeholderText: "Tell a short story of how they reacted when someone disagreed with them."
    }
  ],
  personal_growth: [
    {
      categoryName: "Self-Awareness",
      description: "Their commitment to self-reflection, understanding their limits, and responding to feedback.",
      tagBank: ["Reflective", "Open to Feedback", "Defensive", "Self-Correction", "Blindspots", "Introspective", "Humble"],
      placeholderText: "How did they react the last time they received constructive criticism?"
    },
    {
      categoryName: "Shadow Integration",
      description: "How grounded they remain under pressure, and how they handle ego triggers or projection.",
      tagBank: ["Congruent", "Triggers Easily", "Grounded", "Projections", "Self-Honest", "Ego-Driven", "Composed"],
      placeholderText: "Describe how they handled a highly stressful or emotionally charged situation."
    }
  ],
  social_intelligence: [
    {
      categoryName: "Empathic Listening",
      description: "How deeply they listen to others without interrupting or projecting their own agenda.",
      tagBank: ["Deeply Present", "Validating", "Interrupts", "Distracted", "Compassionate", "Inattentive", "Attuned"],
      placeholderText: "When did you feel most heard and validated by them?"
    },
    {
      categoryName: "Relational Resonance",
      description: "Their capacity to establish genuine, warm, and authentic connections with others.",
      tagBank: ["Warm", "Approachable", "Guarded", "Authentic", "Distant", "Charismatic", "Disconnected"],
      placeholderText: "Describe a moment where their presence made a connection feel authentic."
    }
  ],
  default: [
    {
      categoryName: "Communication Clarity",
      description: "How clearly and effectively they express ideas and set expectations.",
      tagBank: ["Clear", "Direct", "Vague", "Avoidant", "Empathetic", "Inconsistent", "Structured"],
      placeholderText: "Can you provide a quick example of a clear or vague communication from them?"
    },
    {
      categoryName: "Core Trustworthiness",
      description: "Their consistency, alignment between words and actions, and reliability.",
      tagBank: ["Reliable", "Principled", "Flaky", "Transparent", "Inconsistent", "Sincere", "Guarded"],
      placeholderText: "Describe a scenario that demonstrated their level of reliability or trust."
    }
  ]
};

export function getGoalConfig(goalType: string | null): GoalCategoryConfig[] {
  return GOAL_CONFIG_MAP[goalType ?? ''] ?? GOAL_CONFIG_MAP.default;
}

export const SCALING_LABELS: Record<'repstanding' | 'perception_mirror', Record<number, string>> = {
  repstanding: {
    1: "Needs Dev",
    2: "Developing",
    3: "Consistent",
    4: "Highly Effective",
    5: "Outstanding"
  },
  perception_mirror: {
    1: "Growth Opp",
    2: "Emerging",
    3: "Aligned",
    4: "Strongly Tuned",
    5: "Fully Present"
  }
};

