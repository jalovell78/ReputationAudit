export type GrowthGoal =
    | "career_progression"
    | "leadership_mastery"
    | "personal_growth"
    | "social_intelligence"
    | "generic_audit";

export type RaterArchetype =
    | "peer_colleague"
    | "direct_report"
    | "client_customer"
    | "close_friend"
    | "family_member"
    | "critic_challenger";

export interface EmailTemplate {
    subject: string;
    body: string;
}

const FOOTER = "\n\n**100% Identity Protected:** This platform uses AI to sanitize your writing style, syntax, and any identifiable slang. I will only see synthesized insights, never your name or original words. Please be radically honest.\n\nThank you for your help.";

const TEMPLATES: Record<GrowthGoal, Record<RaterArchetype, EmailTemplate>> = {
    career_progression: {
        peer_colleague: {
            subject: "Perspective request: My career brand and trajectory",
            body: "Given our professional connection, I value your perspective. I’m auditing my reputation to see if my internal goals match my external brand. I need the \"hard truth,\" specifically regarding my readiness for the next level and any reputation blindspots noticed throughout our professional history."
        },
        direct_report: {
            subject: "Anonymous feedback: My impact on your growth",
            body: "My goal has always been to be a leader who clears the path for excellence. I value your perspective on how my actions and leadership style have influenced professional growth. Please be radically honest, don't hold back. I am looking for the hard truth on how I can better support professional trajectories."
        },
        client_customer: {
            subject: "Improving our partnership: Professional feedback",
            body: "I am committed to delivering the highest value. I’m conducting a professional audit to understand my reputation from a partner's perspective. What should I do more of? What should I stop doing to better serve professional needs and ensures an effective partnership?"
        },
        close_friend: {
            subject: "A personal favor: How do I show up at work?",
            body: "You know the \"real me.\" I’m trying to see if I’m bringing that same authenticity to my career. As someone close to me, I'd value your take on how my natural character and drive translate to professional success. What's the \"hard truth\" about how you've perceived my professional ambition and presence from the outside?"
        },
        family_member: {
            subject: "Perspective: My career through your eyes",
            body: "You have a unique view of the personality traits and life-long drive that fuel my career. I’m auditing my professional reputation and I’d love your perspective on who I am becoming. Based on what you've seen, what are the natural strengths or blindspots that might be shaping my professional journey?"
        },
        critic_challenger: {
            subject: "The Radical Truth: I need your toughest critique",
            body: "I’ve selected you because you don’t sugarcoat things. I’m auditing my career reputation and I need the dissenting view, the hard truths others are too \"polite\" to say. Be bold and blunt about my professional trajectory, my brand, and any self-sabotaging patterns observed through our connection."
        }
    },
    leadership_mastery: {
        peer_colleague: {
            subject: "My leadership presence: Your honest perspective",
            body: "I'm focused on mastering executive presence and influence. I'd value your honest take on how I've led projects and people. Where have I inspired trust, and where have I caused friction during our professional collaborations?"
        },
        direct_report: {
            subject: "Anonymous feedback: How I can lead better",
            body: "My goal has always been to create an environment where people can do their best work. I need unvarnished feedback on my leadership style. Have I provided enough safety and clarity? Please be direct about what I need to change to lead more effectively."
        },
        client_customer: {
            subject: "Strategic Partnership: Your view on my leadership",
            body: "Beyond our specific projects, I'm auditing my leadership impact. As a key partner, I'd value your view on my decisiveness, reliability, and how I have shown up throughout our professional interactions. What leadership qualities have I shown, and where have I lacked authority?"
        },
        close_friend: {
            subject: "Personal request: How do I lead in real life?",
            body: "I'm working on my leadership skills, but I know that true authority comes from character. Based on our connection, how do you see me leading or influencing those around me? I'm looking for the \"hard truth\" about my natural presence and ability to inspire others."
        },
        family_member: {
            subject: "Perspective: My leadership style through your eyes",
            body: "You know my natural tendencies better than anyone. I'm auditing my leadership style and I'd love your perspective on how I handle authority and responsibility. What are the natural leadership traits, or blindspots, that you've watched me develop throughout our connection?"
        },
        critic_challenger: {
            subject: "The Radical Truth: My leadership blindspots",
            body: "Most people are too polite to tell me where my leadership might be failing. I need a blunt assessment. Where have I lacked authority? Where is my \"leadership presence\" just a facade? Give me the raw data on how I am perceived when I take a leading role."
        }
    },
    personal_growth: {
        peer_colleague: {
            subject: "Personal Evolution: How do I show up as a teammate?",
            body: "I'm on a journey of personal growth and I want to know how my character affects those I work with. I'm looking for feedback on my self-awareness and how I've handled the social pressures of professional life. What's the \"hard truth\" about my personal impact on our collaboration?"
        },
        direct_report: {
            subject: "Growth Feedback: My character and blindspots",
            body: "I believe in leading by example, which includes being open about my own growth. I need your honest take on my character and any blindspots noticed in how I show up as a person, not just a manager. What are the personal traits you've seen that either inspired or distracted those around me?"
        },
        client_customer: {
            subject: "Building Trust: Your take on my professional character",
            body: "Authentic relationships are built on trust. I'm conducting a character audit to understand how my interpersonal style has affected the reliability and trustworthiness I've delivered as a partner. How have my actions matched my values from your perspective? Please be radically honest."
        },
        close_friend: {
            subject: "The Real Me: Help me see my personal blindspots",
            body: "You've seen me in many different contexts and know my history. I'm trying to break some old patterns and I need your help to see the things I'm currently ignoring. Don't worry about \"protecting\" our connection, the raw truth is more important for my evolution."
        },
        family_member: {
            subject: "Evolution: My growth journey and your perspective",
            body: "I'm looking deeply at who I am and who I'm becoming. As family, you have the deepest perspective on my character and history. What patterns am I still stuck in? What parts of my personality need the most evolution? Please don't hold back."
        },
        critic_challenger: {
            subject: "Mirror Check: The hard truths about my character",
            body: "I need someone who will hold up a mirror without a filter. I'm auditing my personal character and I need you to point out the flaws, ego-driven blindspots, and social frictions that others might have overlooked or tolerated throughout our connection."
        }
    },
    social_intelligence: {
        peer_colleague: {
            subject: "Relational Influence: How's my social IQ?",
            body: "I'm focused on improving my social intelligence. I'd value your perspective on my communication style, my ability to listen, and how I've navigated the social complexities of professional life. Where have I lacked awareness in our interactions?"
        },
        direct_report: {
            subject: "Empathy and Influence: Your unvarnished feedback",
            body: "I want to make sure I'm truly listening and connecting. Please be radically honest about my \"Social IQ,\" how well have I made people feel heard? Do I tend to influence through empathy or just authority?"
        },
        client_customer: {
            subject: "Partnering better: Your view on my communication",
            body: "Professional success relies on clear, empathetic communication. I'm auditing my social intelligence to understand how my interpersonal style has affected our partnership. Have I communicated with clarity and empathy, or have I missed key social cues throughout our work together?"
        },
        close_friend: {
            subject: "Connection Check: How do I show up for you?",
            body: "I'm looking at how I connect with the people I care about. Am I actually present? Do I listen well? I need your honest take on my social awareness and empathy, and how it has affected the quality of our connection."
        },
        family_member: {
            subject: "Social IQ: My relationship patterns through your eyes",
            body: "We all have \"default\" ways of communicating that we've carried for years. I'm auditing my social intelligence and I'd love your perspective on my long-term communication habits. Where do I tend to fail when it comes to deep connection or empathy?"
        },
        critic_challenger: {
            subject: "The Radical Truth: Where am I socially unaware?",
            body: "I'm looking for the social friction I've caused but not seen. Please be blunt about my communication failures, my empathy blindspots, and where my attempts at social influence have actually failed."
        }
    },
    generic_audit: {
        peer_colleague: {
            subject: "The Radical Truth: My reputation audit (Anonymous)",
            body: "I'm doing a deep dive into my reputation. I need the feedback that usually stays in the shadows. What is the one thing no one has told me to my face? Whether it's good or bad, I need the raw perspective from our professional connection."
        },
        direct_report: {
            subject: "Anonymous Audit: The feedback I need to hear",
            body: "I'm conducting an anonymous audit of my reputation. I want to build a culture of total transparency, and that starts with me hearing the \"hard truth.\" Please don't hold back or worry about professional repercussions."
        },
        client_customer: {
            subject: "Professional Audit: Your raw perspective",
            body: "I value our connection and I'm looking for an objective assessment of my reputation. What is my biggest strength, and what is the one reason someone might hesitate to work with me again? Be blunt."
        },
        close_friend: {
            subject: "Mirror Phase: What's the truth about me?",
            body: "I'm looking for the unvarnished truth about my reputation. As a friend, I'm asking you to skip the \"polite\" filters and give me the raw data on how I'm perceived. What patterns have you noticed that I am still ignoring?"
        },
        family_member: {
            subject: "Family Audit: Through your eyes (Anonymous)",
            body: "I'm auditing my reputation across all areas of life. As family, you have seen parts of me others haven't. Please be radically honest about who I have been to you and how I show up in the world."
        },
        critic_challenger: {
            subject: "The Hammer: I need your toughest critique",
            body: "I'm looking for the \"Hammer,\" the feedback that shatters my own illusions. I've selected you specifically to deal it to me straight throughout our history. What is the toughest, most direct critique of my reputation you can manage?"
        }
    }
};

export function getRaterEmailTemplate(
    goal: GrowthGoal | string | undefined,
    archetypeGroup: RaterArchetype | string | undefined,
    raterName: string,
    shareUrl: string,
    userName?: string
): EmailTemplate {
    // Normalize goal
    const normalizedGoal: GrowthGoal = (goal as GrowthGoal) in TEMPLATES
        ? (goal as GrowthGoal)
        : "generic_audit";

    // Normalize archetype group
    // Map incoming archetypes to keys
    let key: RaterArchetype = "peer_colleague";
    const group = (archetypeGroup || "").toLowerCase();

    if (group.includes("manager") || group.includes("leader") || group.includes("peer")) key = "peer_colleague";
    else if (group.includes("report")) key = "direct_report";
    else if (group.includes("client") || group.includes("customer")) key = "client_customer";
    else if (group.includes("friend")) key = "close_friend";
    else if (group.includes("family")) key = "family_member";
    else if (group.includes("critic") || group.includes("challenger")) key = "critic_challenger";

    const template = TEMPLATES[normalizedGoal][key];
    const closing = userName ? `\n\nThank you for your help,\n\n${userName}` : `\n\nThank you for your help.`;

    return {
        subject: template.subject,
        body: `Hi ${raterName},\n\n${template.body}\n\nPlease submit your feedback here: ${shareUrl}\n\n100% PRIVACY GUARANTEE:\nThis platform uses AI to sanitize your writing style, syntax, and any identifiable slang. I will only see synthesized insights, never your name or original words. Please be radically honest.${closing}`
    };
}
