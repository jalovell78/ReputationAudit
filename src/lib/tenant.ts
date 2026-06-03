export type TenantType = 'repstanding' | 'perception_mirror';

export interface TenantGoal {
  id: string;
  label: string;
  description: string;
  iconName: string;
}

export interface TenantArchetype {
  id: string;
  label: string;
}

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
  goals: TenantGoal[];
  archetypes: TenantArchetype[];
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
    },
    goals: [
      {
        id: "executive_presence",
        label: "Executive Presence & Influence",
        description: "Project authority, align conflicting stakeholders, and communicate effectively across leadership levels.",
        iconName: "crown"
      },
      {
        id: "high_performance_leadership",
        label: "High-Performance Leadership",
        description: "Scale high-output teams, drive strategic clarity, and unlock execution performance.",
        iconName: "users"
      },
      {
        id: "strategic_impact",
        label: "Strategic Impact & Innovation",
        description: "Move past tactical firefighting, signal organizational vision, and drive long-term business outcomes.",
        iconName: "compass"
      },
      {
        id: "career_progression",
        label: "Career Progression Velocity",
        description: "Build organizational readiness, uncover hidden mobility blocks, and accelerate time-to-promotion.",
        iconName: "briefcase"
      }
    ],
    archetypes: [
      { id: "manager", label: "Manager / Board Member" },
      { id: "peer", label: "Peer / Cross-Functional Colleague" },
      { id: "direct_report", label: "Direct Report / Team Member" },
      { id: "client", label: "Client / Customer / Stakeholder" },
      { id: "mentor", label: "Industry Mentor / Advisor" },
      { id: "challenger", label: "Challenger / Constructive Critic" }
    ]
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
    },
    goals: [
      {
        id: "shadow_integration",
        label: "Shadow Integration & Blindspots",
        description: "Bring hidden behavioral blocks to light, dismantle limiting paradigms, and achieve self-acceptance.",
        iconName: "moon"
      },
      {
        id: "relational_resonance",
        label: "Relational Resonance & Empathy",
        description: "Deepen interpersonal communication, build authentic trust, and cultivate meaningful relationships.",
        iconName: "heart"
      },
      {
        id: "core_alignment",
        label: "Purpose & Core Alignment",
        description: "Align daily habits with core values, bridge internal intent with action, and step out of stagnation.",
        iconName: "compass"
      },
      {
        id: "conscious_presence",
        label: "Conscious Presence & Expression",
        description: "Cultivate personal grounding, conquer the fear of visibility, and speak your truth clearly.",
        iconName: "sparkles"
      }
    ],
    archetypes: [
      { id: "partner", label: "Spouse / Romantic Partner" },
      { id: "friend", label: "Close Friend / Trusted Confidant" },
      { id: "family", label: "Family Member / Sibling / Parent" },
      { id: "guide", label: "Mentor / Spiritual Guide / Coach" },
      { id: "collaborator", label: "Creative Collaborator / Peer" },
      { id: "loving_challenger", label: "Loving Challenger / Accountability Partner" }
    ]
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
  // --- RepStanding Goals ---
  executive_presence: [
    {
      categoryName: "Room Command & Gravitas",
      description: "How effectively they project authority, command attention, and hold space in group settings.",
      tagBank: ['Authoritative', 'Articulate', 'Hesitant', 'Composed', 'Deferential', 'Compelling', 'Polished'],
      placeholderText: "Can you share a specific time they demonstrated strong room command or gravitas?"
    },
    {
      categoryName: "Upward Management & Alignment",
      description: "Their skill in building alignment with senior leadership and managing stakeholder expectations.",
      tagBank: ['Authoritative', 'Articulate', 'Hesitant', 'Composed', 'Deferential', 'Compelling', 'Polished'],
      placeholderText: "Give an example of how they managed up or aligned conflicting interests."
    }
  ],
  high_performance_leadership: [
    {
      categoryName: "Team Empowerment & Decentralization",
      description: "Their capacity to delegate authority, empower team members, and avoid micromanagement.",
      tagBank: ['Decisive', 'Empowering', 'Micromanager', 'Action-Biased', 'Protective', 'Avoidant', 'Demanding'],
      placeholderText: "Can you share an example of how they delegated or empowered others?"
    },
    {
      categoryName: "Accountability & Friction Removal",
      description: "How effectively they hold people accountable and remove operational friction to maintain velocity.",
      tagBank: ['Decisive', 'Empowering', 'Micromanager', 'Action-Biased', 'Protective', 'Avoidant', 'Demanding'],
      placeholderText: "Tell a short story of how they handled accountability or cleared a roadblock."
    }
  ],
  strategic_impact: [
    {
      categoryName: "Vision Signaling & Systemic Planning",
      description: "Their ability to communicate long-term direction, think systemically, and plan beyond short-term needs.",
      tagBank: ['Visionary', 'Data-Driven', 'Short-Sighted', 'Results-Oriented', 'Disruptive', 'Risk-Averse', 'Analytical'],
      placeholderText: "Can you describe a time they demonstrated systemic thinking or vision signaling?"
    },
    {
      categoryName: "Calculated Risk-Taking",
      description: "How they evaluate risk, embrace disruption, and navigate ambiguity to innovate.",
      tagBank: ['Visionary', 'Data-Driven', 'Short-Sighted', 'Results-Oriented', 'Disruptive', 'Risk-Averse', 'Analytical'],
      placeholderText: "Describe a moment where they took a calculated risk or introduced a new idea."
    }
  ],
  career_progression: [
    {
      categoryName: "Value Visibility & Corporate Optics",
      description: "How effectively they showcase achievements, manage corporate perception, and build their professional brand.",
      tagBank: ['Promotable', 'Quiet-Worker', 'Politically-Astute', 'Indispensable', 'Isolated', 'Self-Promoting'],
      placeholderText: "Can you share an example of how they made their work or value visible?"
    },
    {
      categoryName: "Sponsorship & Network Building",
      description: "Their ability to cultivate strategic advocates, build alliances, and navigate internal networks.",
      tagBank: ['Promotable', 'Quiet-Worker', 'Politically-Astute', 'Indispensable', 'Isolated', 'Self-Promoting'],
      placeholderText: "Give an example of how they leveraged their network or built sponsorship."
    }
  ],

  // --- The Perception Mirror Goals ---
  shadow_integration: [
    {
      categoryName: "Unconscious Defense Patterns",
      description: "Their awareness of hidden insecurities, defensiveness, and behavioral projections under pressure.",
      tagBank: ['Deeply-Aware', 'Defensive', 'Masking', 'Authentic', 'Projecting', 'Vulnerable', 'People-Pleaser'],
      placeholderText: "Can you describe a time they showed defensiveness or projected an insecurity?"
    },
    {
      categoryName: "Receptivity to Shadow Feedback",
      description: "How openly they welcome deep feedback about their limitations, blindspots, and patterns.",
      tagBank: ['Deeply-Aware', 'Defensive', 'Masking', 'Authentic', 'Projecting', 'Vulnerable', 'People-Pleaser'],
      placeholderText: "Give an example of how they received feedback on a sensitive or hidden topic."
    }
  ],
  relational_resonance: [
    {
      categoryName: "Somatic & Empathic Presence",
      description: "Their ability to listen deeply, show authentic empathy, and maintain present attention.",
      tagBank: ['Deeply-Present', 'Validating', 'Distracted', 'Compassionate', 'Emotionally-Guarded', 'Nurturing'],
      placeholderText: "Describe a moment when you felt fully heard, seen, and validated by them."
    },
    {
      categoryName: "Co-Regulation & Emotional Safety",
      description: "How effectively they create emotional safety, resolve conflicts gently, and co-regulate with others.",
      tagBank: ['Deeply-Present', 'Validating', 'Distracted', 'Compassionate', 'Emotionally-Guarded', 'Nurturing'],
      placeholderText: "Tell a short story of how they helped bring calm or safety to a tense situation."
    }
  ],
  core_alignment: [
    {
      categoryName: "Intent-to-Action Coherence",
      description: "How closely their daily actions, habits, and speech align with their stated core values.",
      tagBank: ['Centered', 'Congruent', 'Unfocused', 'Drifting', 'Purpose-Driven', 'Complacent', 'Grounded'],
      placeholderText: "Can you share an example of their actions matching their deepest values?"
    },
    {
      categoryName: "Expansion vs. Stagnation",
      description: "Their willingness to step out of comfort zones, grow, and avoid complacent stagnation.",
      tagBank: ['Centered', 'Congruent', 'Unfocused', 'Drifting', 'Purpose-Driven', 'Complacent', 'Grounded'],
      placeholderText: "Describe a moment where they chose growth and expansion over comfort."
    }
  ],
  conscious_presence: [
    {
      categoryName: "Radical Visibility & Vulnerability",
      description: "Their capacity to show vulnerability, stand in their authentic truth, and let themselves be seen.",
      tagBank: ['Radically-Honest', 'Shrinking', 'Expressive', 'Guarded', 'Boundary-Set', 'Apologetic', 'Luminous'],
      placeholderText: "Can you share a time they showed true vulnerability or radical honesty?"
    },
    {
      categoryName: "Authentic Voice Expression",
      description: "How clearly and confidently they express their authentic voice without shrinking or apologetic boundaries.",
      tagBank: ['Radically-Honest', 'Shrinking', 'Expressive', 'Guarded', 'Boundary-Set', 'Apologetic', 'Luminous'],
      placeholderText: "Give an example of how they spoke their truth or set clear, authentic boundaries."
    }
  ],

  // --- Fallback & Legacy Goals ---
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
  const normalizedKey = goalType ?? '';
  return GOAL_CONFIG_MAP[normalizedKey] ?? GOAL_CONFIG_MAP.default;
}

export function getGoalLabel(goalType: string | null): string {
  if (!goalType) return '';
  // Check in repstanding goals
  const rsGoal = tenantConfigs.repstanding.goals.find(g => g.id === goalType);
  if (rsGoal) return rsGoal.label;
  // Check in perception_mirror goals
  const pmGoal = tenantConfigs.perception_mirror.goals.find(g => g.id === goalType);
  if (pmGoal) return pmGoal.label;
  // Fallbacks for legacy/historical keys
  const legacyLabels: Record<string, string> = {
    career_progression: "Career Progression",
    leadership_mastery: "Leadership Mastery",
    personal_growth: "Personal Growth",
    social_intelligence: "Social Intelligence",
  };
  return legacyLabels[goalType] ?? goalType.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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

export function getArchetypes(tenant?: string): TenantArchetype[] {
  if (tenant === 'repstanding' || tenant === 'perception_mirror') {
    return tenantConfigs[tenant].archetypes;
  }
  return tenantConfigs.repstanding.archetypes;
}

export function getArchetypeLabel(archetypeKey: string | null | undefined): string {
  if (!archetypeKey) return '';
  for (const t of Object.keys(tenantConfigs) as TenantType[]) {
    const found = tenantConfigs[t].archetypes.find(a => a.id === archetypeKey || a.label === archetypeKey);
    if (found) return found.label;
  }
  const fallbackMap: Record<string, string> = {
    manager: "Manager / Board Member",
    peer: "Peer / Cross-Functional Colleague",
    direct_report: "Direct Report / Team Member",
    client: "Client / Customer / Stakeholder",
    mentor: "Industry Mentor / Advisor",
    challenger: "Challenger / Constructive Critic",
    partner: "Spouse / Romantic Partner",
    friend: "Close Friend / Trusted Confidant",
    family: "Family Member / Sibling / Parent",
    guide: "Mentor / Spiritual Guide / Coach",
    collaborator: "Creative Collaborator / Peer",
    loving_challenger: "Loving Challenger / Accountability Partner",
    "Manager / Senior Leader": "Manager / Board Member",
    "Peer / Colleague": "Peer / Cross-Functional Colleague",
    "Direct Report": "Direct Report / Team Member",
    "Client / Customer": "Client / Customer / Stakeholder",
    "Close Friend": "Close Friend / Trusted Confidant",
    "Family Member": "Family Member / Sibling / Parent",
    "Critic / Challenger": "Challenger / Constructive Critic"
  };
  return fallbackMap[archetypeKey] ?? archetypeKey;
}

