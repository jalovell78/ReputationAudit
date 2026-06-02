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

