export const TOTAL_YEARS_EXPERIENCE = new Date().getFullYear() - 2018

// The job title the resume summary opens with. Applications go out mirroring the
// target posting's exact title, so this is overridable per download via
// `/api/resume?title=Senior%20Frontend%20Engineer`.
export const RESUME_DEFAULT_TITLE = "Full Stack Software Developer"

export const buildResumeSummary = (title: string = RESUME_DEFAULT_TITLE) =>
  `${title} with ${TOTAL_YEARS_EXPERIENCE}+ years building production web and mobile applications in React (ReactJS), Next.js, React Native, TypeScript, Node.js, and Laravel, across real-time platforms, e-commerce, and enterprise systems.`

export const PERSONAL_INFO = {
  name: "Sk. Ridwanul Malik",
  title: "I build things for the web",
  intro: "Hi, my name is",
  description: `I'm a software engineer and Full Stack Web Developer specializing in building exceptional digital experiences, backed by excellent problem-solving skills. Passionate about coding and learning new technologies, with more than ${TOTAL_YEARS_EXPERIENCE} years of experience in React (Next.js), React Native, Laravel (PHP), Node.js, and WordPress.`,
  // Condensed summary used in the resume PDF (kept to ~2 lines / under 255 characters).
  // Written in implied-subject voice and leading with years — ATS resume checkers flag
  // first-person openers and "passionate about" as filler.
  resumeSummary: buildResumeSummary(),
  // Used for the meta/OG/Twitter tags only, so both are sized for them: search
  // results show ~50-60 characters of title, and social cards cut descriptions
  // off around 125 characters on mobile.
  metaTitle: "Sk. Ridwanul Malik — Full Stack Developer",
  metaDescription: `React, Next.js, React Native, Node.js. ${TOTAL_YEARS_EXPERIENCE}+ years turning ideas into products that ship — web, iOS and Android. Open to remote.`,
  email: "skridwanulmalik@gmail.com",
  phone: "+880 1734-862996",
  // Country spelled out — location parsers match poorly on two-letter codes
  location: "Jashore, Bangladesh",
  availability: "Open to remote",
  resume: "/api/resume",
  website: "https://ridwanmalik.com",
}

// Content for the "Get In Touch" modal opened from the header/nav
export const CONTACT_MODAL = {
  title: "Get In Touch",
  description: "Pick whichever works best for you — my inbox is always open.",
  options: {
    email: {
      label: "Email me",
      description: PERSONAL_INFO.email,
    },
    copy: {
      label: "Copy email address",
      copiedLabel: "Copied to clipboard!",
    },
    resume: {
      label: "Download my resume",
      description: "PDF · generated from this site",
    },
  },
  socialsLabel: "Or find me on",
}

export const TECH_STACK = [
  "React",
  "Next.js",
  "React Native",
  "Tailwind CSS",
  "Node.js",
  "PHP",
  "Laravel",
  "MySQL",
  "Supabase",
  "Firebase",
]

// Categorized skills for the generated resume. ATS keyword matching weighs the skills
// block heaviest and compares exact strings, so spellings mirror how job descriptions
// write them ("ReactJS" and "React" both appear).
//
// "REST API Development" is deliberately one string: it contains both "REST API" and
// "API Development" as substrings, so it matches whichever phrasing a posting uses.
//
// This block is length-critical: the resume is designed to fit on one page, and the job
// entries below render with wrap={false}, so a single extra wrapped line here pushes a
// whole role onto a second page. Measured 2026-08-21 — adding "REST API Development" on
// its own tipped the resume to two pages; dropping "Ionic" (still evidenced by the Dream
// Diver bullet) bought the room back. Re-check the PDF page count after any addition
// here, and read the generated text layer, not just the rendered page.
export const RESUME_SKILLS = [
  {
    label: "Programming Languages",
    items: ["JavaScript", "TypeScript", "PHP", "SQL", "HTML", "CSS", "Sass"],
  },
  {
    label: "Libraries & Frameworks",
    items: [
      "React (ReactJS)",
      "Next.js (NextJS)",
      "React Native",
      "Redux",
      "Node.js",
      "Laravel",
      "Tailwind CSS",
      "REST API Development",
      "Vue.js",
      "WebSockets",
    ],
  },
  {
    label: "Tools & Platforms",
    items: [
      "Git",
      "GitHub",
      "Vercel",
      "DigitalOcean",
      "MySQL",
      "PostgreSQL",
      "Firebase",
      "Supabase",
      "WordPress",
      "WooCommerce",
      "Docker",
      "CI/CD",
      "Azure DevOps",
      "Stripe",
      "Storybook",
      "Figma",
      "AI Assisted Coding",
      "Copilot",
      "Claude Code",
    ],
  },
]

// Work experience — shared by the Experience section and the generated resume PDF.
//
// The website shows every role with its true dates. The resume shows a deliberately
// reduced, linear subset, controlled by two optional fields:
//   hideFromResume - drop the role from the PDF only (it stays on the site)
//   resumePeriod   - override the dates in the PDF only (`period` stays true on the site)
// Roles cut from the resume were the ones carrying no quantified result; the remaining
// four run junior -> senior with no overlaps and no gaps. See docs/_ATS-JOB-TEST-RESULTS.md
// for the full reasoning and the timeline it produces.
//
// `location` and `address` are for application forms, not the site. Job applications ask for
// an employer location on every work-history row; `location` is the city-level answer those
// fields expect, `address` the full street address where it is known. Only the four roles
// that appear on the resume carry them so far.
export const EXPERIENCES = [
  {
    company: "Scouty Interactive",
    url: "https://scouty.io",
    location: "Vancouver, Canada",
    role: "Senior Software Developer",
    period: "November 2022 - Present",
    resumePeriod: "December 2022 - Present",
    resumeBulletLimit: 4,
    resumeBullets: [
      "Built Scouty, a football team management platform, as a Next.js web app paired with a React Native mobile app for iOS and Android.",
      "Implemented real-time communication with Firebase, delivering live updates across coaches, players, and admins.",
      "Lead the team's technical direction and code reviews across web and mobile.",
      "Integrated Stripe for subscription billing and deployed the web app to DigitalOcean with Nginx, SSL, and PM2.",
    ],
    description: [
      "Designed and built Scouty (scouty.io), a football team management platform with a Next.js web app and a cross-platform React Native mobile app for iOS and Android.",
      "Implemented real-time communication features using Firebase, enabling live updates for coaches, players, and administrators across teams.",
      "Integrated Stripe for subscription billing and managed deployment of both the web and mobile apps, including App Store and Google Play releases.",
    ],
  },
  {
    company: "Equal & Co.",
    url: "https://equalandco.com",
    role: "Software Developer",
    period: "January 2022 - Present",
    hideFromResume: true,
    resumeBullets: [
      "Developed a React Industrial Liquid Management system, optimizing interface interactions across both admin and customer panels.",
      "Integrated WebSockets to handle high-frequency data streams, driving accurate, timely updates to interactive graphs.",
      "Designed the REST API contracts and SQL schema backing the reporting views.",
    ],
    description: [
      "Working the development of a React-based Industrial Liquid Management system, optimizing interface interactions for both admin and customer panels.",
      "Utilized WebSockets to efficiently handle high-frequency data streams, ensuring accurate and timely updates to interactive graphs.",
    ],
  },
  {
    company: "Source Expert",
    url: "https://sourceexpert.net",
    role: "Senior Full Stack Developer",
    period: "November 2024 - Present",
    hideFromResume: true,
    description: [
      "Building and shipping production web and mobile applications for international clients as part of a 15+ engineer team spanning the USA and Bangladesh.",
      "Developing full-stack solutions using React.js, React Native, Next.js, and Node.js from concept through deployment.",
      "Contributing to high-performance, scalable digital products across e-commerce, food delivery, and SaaS domains.",
    ],
  },
  {
    company: "Oxford International School",
    url: "https://ois.edu.bd",
    role: "Software Developer",
    period: "December 2023 - October 2025",
    hideFromResume: true,
    description: [
      "Developing and maintaining the school's Education Management System (EMS) used across multiple campuses in Dhaka.",
      "Building React.js-based interfaces for academic administration, student records, and internal workflows.",
      "Working in a hybrid part-time capacity alongside the school's operations team.",
    ],
  },
  {
    company: "Talent Pro",
    url: "https://talentpro.global",
    location: "Dhaka, Bangladesh",
    address: "109 Masjid Road, Old DOHS, Banani, Dhaka, Bangladesh",
    role: "Software Developer",
    period: "February 2022 - July 2023",
    resumePeriod: "January 2022 - December 2022",
    resumeBullets: [
      "Developed and deployed a Next.js real estate web application, improving load times by 30% through optimization techniques.",
      "Built a Vue.js and Laravel admin panel for the same product, expanding property management capability.",
      "Built a React and Laravel stock exchange project.",
    ],
    description: [
      "Worked on a React & Laravel based Stock Exchange Project.",
      "Developed and deployed a Next.js-based Real Estate Web Application, improving load times by 30% through optimization techniques.",
      "Built a Vue.js and Laravel-based admin panel for a Real Estate Project, enhancing user management capabilities.",
    ],
  },
  {
    company: "Dynamicflow",
    url: "https://dynamicflowit.com",
    role: "Full Stack Web Developer",
    period: "May 2021 - January 2022",
    hideFromResume: true,
    resumeBullets: [
      "Created a React-based tournament management website, cutting admin overhead by automating scheduling and team coordination.",
      "Launched an online exam system serving over 10,000 users with secure, scalable testing features.",
    ],
    description: [
      "Created a React-based Tournament Management Website, reducing admin overhead by automating scheduling and team coordination.",
      "Built a website for a prominent music artist, increasing online visibility and fan engagement through interactive elements.",
      "Launched an Online Exam System for over 10,000 users, implementing secure, scalable testing features.",
    ],
  },
  {
    company: "Dream Diver",
    url: "https://dreamdiver.nl",
    location: "Rotterdam, Netherlands",
    address: "Westerbeekstraat 10B, 3074 DH Rotterdam, Netherlands",
    role: "Web & Apps Developer",
    period: "July 2020 - December 2021",
    // Resume leads with the React/Next.js work rather than the default first bullet
    resumeBullets: [
      "Launched a React (Next.js) website and Ionic PWA for a package delivery company, achieving a 25% increase in customer satisfaction.",
      "Engineered a Laravel-based patient management solution covering records, appointments, and billing.",
      "Built a cross-platform food ordering app with Ionic, shipping to both iOS and Android.",
    ],
    description: [
      "Engineered a robust Laravel-based patient management solution to streamline patient records, appointments, and billing processes.",
      "Designed and launched a React (Next.js) Website & Ionic PWA for a Package Delivery Company, achieving a 25% increase in customer satisfaction.",
      "Designed and developed a cross-platform mobile app using Ionic Framework to provide seamless food ordering experiences for users on iOS and Android devices.",
    ],
  },
  {
    company: "Watchflix, Pty Ltd.",
    url: null,
    role: "Executive, (Web Application Developer)",
    period: "October 2020 - May 2021",
    hideFromResume: true,
    description: [
      "Developed a Laravel OTT Platform Web App, which scaled to over 10,000 active users with optimized video streaming capabilities.",
      "Integrated PayPal, SSLCOMMERZ Payment Gateway, and SMS APIs, improving user payment experience and transaction reliability.",
    ],
  },
  {
    company: "7 Info Tech",
    url: "https://7infotech.com.bd",
    location: "Jessore, Bangladesh",
    address: "Neel Ratan Dhar Road (Bhola Tank Road), Fire Service Samne, Jessore, Bangladesh",
    role: "Junior Web Developer",
    period: "August 2018 - July 2020",
    description: [
      "Built a Raw PHP-based Inventory Management System with data tracking, enhancing inventory accuracy for 1,000+ users.",
      "Developed and customized WordPress E-commerce sites, improving site speed and user engagement.",
    ],
  },
]

// Portfolio projects — shared by the Projects section and the generated resume PDF
export const PROJECTS = {
  featured: [
    {
      title: "Scouty",
      description:
        "A football team management application that enables efficient team and player management. Features a Next.js web app and cross-platform mobile app using React Native with real-time communication features for coaches, players, and administrators.",
      tech: ["React", "Next.js", "React Native", "Firebase", "Laravel", "Stripe"],
      external: "https://scouty.io",
      appStore: "https://apps.apple.com/us/app/scouty-app/id6654929904",
      playStore: "https://play.google.com/store/apps/details?id=io.scouty",
      image: "/assets/scouty.png",
    },
    {
      title: "RealEzy",
      description:
        "A comprehensive real estate web application for apartment bookings, improving booking efficiency and user interface satisfaction. Built with Next.js for the frontend and Vue.js & Laravel for the admin panel, providing backend flexibility for property management.",
      tech: ["React", "Next.js", "Vue.js", "Laravel", "MySQL"],
      external: "https://realezy.com",
      image: "/assets/realezy.png",
    },
    {
      title: "Zenith Labs",
      description:
        "A full-stack e-commerce platform for a Canadian research peptide company. Built with Next.js and Supabase, featuring a product catalog, shopping cart, age-gating, a custom Peptide Calculator tool, and a complete checkout flow with secure payments.",
      tech: ["Next.js", "Supabase", "React", "Tailwind CSS"],
      external: "https://zenithpeptides.ca",
      image: "/assets/zenith.png",
    },
    {
      title: "HealthFlow",
      description:
        "A healthcare platform connecting hospitals, clinics, doctors, diagnostic centers and pharmacies in one place. Built with Next.js and Supabase, it lets patients book appointments and view reports and invoices, while providers manage patient records, wards and beds, lab orders, pharmacy stock and billing.",
      tech: ["Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS", "shadcn/ui"],
      external: "https://healthflowbd.com",
      image: "/assets/healthflow.png",
      hideFromResume: true,
    },
  ],
  other: [
    {
      title: "Bangla Iqra Academy",
      description:
        "A Learning Management System for an online Quran and Islamic education academy, with course management, student enrollment and admin dashboards.",
      tech: ["Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS", "shadcn/ui"],
      external: "https://banglaiqraacademy.com/",
    },
    {
      title: "SourceExpert Website",
      description:
        "The company website for SourceExpert, a software engineering firm with teams in the USA and Bangladesh, showcasing its web, mobile, AI and cloud services.",
      tech: ["Next.js", "React"],
      external: "https://sourceexpert.net",
    },
    {
      title: "ETS Telco ISP Website",
      description:
        "A Node.js web platform to streamline the process of ordering and managing internet services for customers.",
      tech: ["Node.js", "HTML", "CSS"],
      external: "https://etstelco.com",
    },
    {
      title: "Netflix Clone",
      description:
        "A Netflix-like web application that you can use to browse movies and TV shows. As like as Netflix movie slider in dark mode.",
      tech: ["React", "Next.js", "Tailwind CSS", "TMDB API"],
      github: "https://github.com/ridwanmalik/netflix-clone",
      external: "https://rio-watch.vercel.app/",
    },
    {
      title: "Next SaaS Admin UI",
      description:
        "An open-source admin dashboard template for indie SaaS products, with a collapsible sidebar layout, dark and light themes, accent colors, a sortable and searchable data table, and a settings page.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
      github: "https://github.com/ridwanmalik/next-saas-admin-ui",
    },
    {
      title: "SENSE HAIR",
      description:
        "A professional hair salon booking website designed and built with Next.js. The platform enhances booking accuracy and user engagement with a beautiful, intuitive interface for stylist appointments and service scheduling.",
      tech: ["Next.js", "React", "Tailwind CSS", "Laravel", "MySQL"],
      external: "https://sensehair.nl",
    },
    {
      title: "Garam Masala Food Ordering",
      description:
        "A PHP-based food ordering system with table booking capabilities, which boosted customer convenience and reservation volume for the restaurant.",
      tech: ["PHP", "MySQL", "JavaScript", "CSS"],
      external: "https://garam-masala.nl",
    },
    {
      title: "Tournament Management System",
      description:
        "A React-based Tournament Management Website that reduces admin overhead by automating scheduling and team coordination.",
      tech: ["React", "Node.js", "MongoDB", "Socket.io"],
      external: null,
    },
    {
      title: "Patient Management System",
      description:
        "A robust Laravel-based patient management solution to streamline patient records, appointments, and billing processes.",
      tech: ["Laravel", "PHP", "MySQL"],
      external: null,
    },
    {
      title: "Online Exam System",
      description:
        "An Online Exam System for over 10,000 users, implementing secure, scalable testing features with real-time monitoring.",
      tech: ["PHP", "HTML", "CSS"],
      external: null,
    },
    {
      title: "Uniget BD",
      description:
        "A marketing website for an air and ocean freight forwarding company operating since 2005, with offices in Dhaka and Chittagong.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
      external: "https://hub-freight.vercel.app",
    },
    {
      title: "Verified by Tenants",
      description:
        "A rental review platform that collects real tenant reviews and verifies every claim with documentation, showing the reality behind each rental.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
      external: "https://verifiedbytenants.vercel.app",
    },
  ],
}

// Certifications — shared by the Certification section and the generated resume PDF
export const CERTIFICATIONS = [
  // React
  {
    title: "React + Redux Certified",
    issuer: "SoloLearn, Inc.",
    url: "https://www.sololearn.com/en/certificates/CT-ZO6UD2UD",
    icon: "react",
    resumeFeatured: true,
  },
  {
    title: "Frontend Developer (React)",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/af9119c8d91f",
    icon: "react",
    resumeFeatured: true,
  },
  {
    title: "React (Basic)",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/93696da69617",
    icon: "react",
  },
  // JavaScript
  {
    title: "JavaScript Certified",
    issuer: "SoloLearn, Inc.",
    url: "https://www.sololearn.com/en/certificates/CT-HI8LUC9C",
    icon: "javascript",
    hideOnMobile: true,
  },
  {
    title: "JavaScript (Intermediate)",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/2b87f9f4557d",
    icon: "javascript",
    hideOnMobile: true,
  },
  {
    title: "JavaScript (Basic)",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/47a154d2e127",
    icon: "javascript",
    hideOnMobile: true,
  },
  // Problem Solving
  {
    title: "Problem Solving (Intermediate)",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/5838db2fe399",
    icon: "algorithm",
    resumeFeatured: true,
  },
  {
    title: "Problem-Solving (Basic)",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/e5f3b68d3684",
    icon: "algorithm",
    hideOnMobile: true,
  },
  // Other
  {
    title: "PHP Certified",
    issuer: "SoloLearn, Inc.",
    url: "https://www.sololearn.com/en/certificates/CT-SBL1OYHQ",
    icon: "php",
  },
  {
    title: "CSS (Basic)",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/03bfe39e8db9",
    icon: "css",
  },
]

export const TECH_STACK_DETAILED = [
  {
    name: "JavaScript",
    level: 100,
    description:
      "Advanced proficiency in modern JavaScript (ES6+), including async/await, modules, and complex data structures.",
  },
  {
    name: "PHP",
    level: 100,
    description:
      "Expert-level PHP development with object-oriented programming, design patterns, and modern frameworks.",
  },
  {
    name: "React",
    level: 100,
    description: "Advanced React development including hooks, context, state management, and performance optimization.",
  },
  {
    name: "Next.js",
    level: 100,
    description: "Full-stack Next.js applications with SSR, SSG, API routes, and modern deployment strategies.",
  },
  {
    name: "React Native",
    level: 100,
    description: "Cross-platform mobile app development with native performance and platform-specific optimizations.",
  },
  {
    name: "Laravel",
    level: 100,
    description:
      "Enterprise-level Laravel applications with Eloquent ORM, API development, and complex business logic.",
  },
  {
    name: "Node.js",
    level: 100,
    description: "Server-side JavaScript with Express.js, real-time applications, and microservices architecture.",
  },
  {
    name: "MySQL",
    level: 100,
    description: "Advanced database design, optimization, complex queries, and performance tuning.",
  },
  {
    name: "WordPress",
    level: 100,
    description: "Custom theme development, plugin creation, and WooCommerce e-commerce solutions.",
  },
  {
    name: "WooCommerce",
    level: 100,
    description: "E-commerce development with custom integrations, payment gateways, and inventory management.",
  },
  {
    name: "Sass",
    level: 100,
    description: "Advanced CSS preprocessing with mixins, functions, and scalable stylesheet architecture.",
  },
  {
    name: "Vue.js",
    level: 80,
    description: "Component-based development with Vuex state management and Vue Router for SPA applications.",
  },
  {
    name: "Ionic",
    level: 80,
    description: "Hybrid mobile app development with web technologies and native device features integration.",
  },
  {
    name: "Firebase",
    level: 80,
    description: "Real-time databases, authentication, hosting, and cloud functions for modern web applications.",
  },
  {
    name: "Docker",
    level: 80,
    description: "Containerization, multi-stage builds, and deployment orchestration for scalable applications.",
  },
  {
    name: "DevOps",
    level: 80,
    description: "CI/CD pipelines, server management, monitoring, and infrastructure automation.",
  },
]

// Technology database for hover cards (comprehensive list)
export const TECHNOLOGIES = {
  JavaScript: {
    name: "JavaScript",
    category: "Programming Language",
    description:
      "A high-level, interpreted programming language that is one of the core technologies of the World Wide Web.",
    features: ["Dynamic typing", "Prototype-based OOP", "First-class functions", "Event-driven"],
    color: "bg-yellow-500",
    aliases: ["JS", "javascript", "js"],
  },
  TypeScript: {
    name: "TypeScript",
    category: "Programming Language",
    description:
      "A strongly typed superset of JavaScript that compiles to plain JavaScript, adding static types for safer, more maintainable code at scale.",
    features: ["Static typing", "Type inference", "Interfaces & generics", "First-class tooling"],
    color: "bg-blue-500",
    aliases: ["typescript", "ts"],
  },
  PHP: {
    name: "PHP",
    category: "Programming Language",
    description:
      "A popular general-purpose scripting language especially suited for web development and server-side programming.",
    features: ["Cross-platform", "Open source", "Large ecosystem", "Easy deployment"],
    color: "bg-purple-600",
    aliases: ["php"],
  },
  React: {
    name: "React",
    category: "Frontend Framework",
    description:
      "A JavaScript library for building user interfaces, particularly web applications with complex, interactive UIs.",
    features: ["Component-based architecture", "Virtual DOM", "Hooks", "State management"],
    color: "bg-blue-400",
    aliases: ["react", "reactjs"],
  },
  "Next.js": {
    name: "Next.js",
    category: "Full-stack Framework",
    description:
      "A React framework for production that provides server-side rendering, static site generation, and full-stack capabilities.",
    features: ["SSR/SSG", "API Routes", "File-based routing", "Image optimization"],
    color: "bg-gray-800",
    aliases: ["nextjs", "next.js", "next"],
  },
  "React Native": {
    name: "React Native",
    category: "Mobile Framework",
    description: "A framework for building native mobile applications using React and JavaScript.",
    features: ["Cross-platform", "Native performance", "Hot reloading", "Code sharing"],
    color: "bg-blue-500",
    aliases: ["react-native", "reactnative", "rn"],
  },
  Laravel: {
    name: "Laravel",
    category: "Backend Framework",
    description:
      "A PHP web application framework with expressive, elegant syntax for rapid development of modern web applications.",
    features: ["Eloquent ORM", "Artisan CLI", "Blade templating", "Built-in testing"],
    color: "bg-red-500",
    aliases: ["laravel"],
  },
  "Node.js": {
    name: "Node.js",
    category: "Runtime Environment",
    description:
      "A JavaScript runtime built on Chrome's V8 engine that allows you to run JavaScript on the server side.",
    features: ["Event-driven", "Non-blocking I/O", "NPM ecosystem", "Cross-platform"],
    color: "bg-green-600",
    aliases: ["nodejs", "node.js", "node"],
  },
  MySQL: {
    name: "MySQL",
    category: "Database",
    description:
      "An open-source relational database management system known for its reliability, performance, and ease of use.",
    features: ["ACID compliance", "High performance", "Scalability", "Security features"],
    color: "bg-blue-600",
    aliases: ["mysql"],
  },
  WordPress: {
    name: "WordPress",
    category: "CMS",
    description: "A content management system and website creation platform used by millions of websites worldwide.",
    features: ["Plugin ecosystem", "Theme system", "SEO friendly", "User management"],
    color: "bg-blue-700",
    aliases: ["wordpress", "wp"],
  },
  WooCommerce: {
    name: "WooCommerce",
    category: "E-commerce",
    description: "A WordPress plugin that transforms WordPress sites into fully functional e-commerce stores.",
    features: ["Payment gateways", "Inventory management", "Order tracking", "Extensions"],
    color: "bg-purple-700",
    aliases: ["woocommerce", "woo"],
  },
  Sass: {
    name: "Sass",
    category: "CSS Preprocessor",
    description: "A CSS extension language that adds features like variables, nesting, and mixins to CSS.",
    features: ["Variables", "Nesting", "Mixins", "Functions"],
    color: "bg-pink-500",
    aliases: ["sass", "scss"],
  },
  "Vue.js": {
    name: "Vue.js",
    category: "Frontend Framework",
    description:
      "A progressive JavaScript framework for building user interfaces with an approachable, versatile, and performant design.",
    features: ["Template syntax", "Reactivity", "Component composition", "Vue CLI"],
    color: "bg-green-500",
    aliases: ["vue", "vuejs", "vue.js"],
  },
  Ionic: {
    name: "Ionic",
    category: "Mobile Framework",
    description: "A framework for building cross-platform mobile applications using web technologies.",
    features: ["Cross-platform", "Native UI components", "Capacitor plugins", "Angular/React/Vue support"],
    color: "bg-blue-500",
    aliases: ["ionic"],
  },
  Firebase: {
    name: "Firebase",
    category: "Backend Service",
    description:
      "Google's mobile and web application development platform with real-time database and authentication services.",
    features: ["Real-time database", "Authentication", "Cloud functions", "Hosting"],
    color: "bg-orange-500",
    aliases: ["firebase"],
  },
  Supabase: {
    name: "Supabase",
    category: "Backend Service",
    description:
      "An open-source Firebase alternative providing a PostgreSQL database, authentication, real-time subscriptions, and storage.",
    features: ["PostgreSQL", "Row-level security", "Real-time subscriptions", "Auth & Storage"],
    color: "bg-emerald-600",
    aliases: ["supabase"],
  },
  Docker: {
    name: "Docker",
    category: "DevOps",
    description: "A platform for developing, shipping, and running applications using containerization technology.",
    features: ["Containerization", "Microservices", "CI/CD integration", "Cross-platform"],
    color: "bg-blue-600",
    aliases: ["docker"],
  },
  DevOps: {
    name: "DevOps",
    category: "Methodology",
    description:
      "A set of practices that combines software development and IT operations to shorten development lifecycle.",
    features: ["CI/CD", "Infrastructure as Code", "Monitoring", "Automation"],
    color: "bg-gray-600",
    aliases: ["devops"],
  },
  Git: {
    name: "Git",
    category: "Version Control",
    description:
      "A distributed version control system for tracking changes in source code during software development.",
    features: ["Distributed", "Branching", "Merging", "History tracking"],
    color: "bg-orange-600",
    aliases: ["git"],
  },
  GitHub: {
    name: "GitHub",
    category: "Development Platform",
    description: "A web-based platform for version control and collaboration using Git repositories.",
    features: ["Code hosting", "Pull requests", "Issues tracking", "CI/CD"],
    color: "bg-gray-900",
    aliases: ["github"],
  },
  "REST APIs": {
    name: "REST APIs",
    category: "Web Service",
    description: "Representational State Transfer - an architectural style for designing networked applications.",
    features: ["Stateless", "HTTP methods", "Resource-based", "JSON/XML"],
    color: "bg-green-700",
    aliases: ["rest", "rest-api", "restful"],
  },
  GraphQL: {
    name: "GraphQL",
    category: "Query Language",
    description: "A data query and manipulation language for APIs, and a runtime for fulfilling queries.",
    features: ["Type system", "Single endpoint", "Real-time subscriptions", "Introspection"],
    color: "bg-pink-600",
    aliases: ["graphql"],
  },
  WebSockets: {
    name: "WebSockets",
    category: "Communication Protocol",
    description: "A communication protocol providing full-duplex communication channels over a single TCP connection.",
    features: ["Real-time communication", "Bidirectional", "Low latency", "Event-driven"],
    color: "bg-indigo-600",
    aliases: ["websocket", "websockets"],
  },
  "Tailwind CSS": {
    name: "Tailwind CSS",
    category: "CSS Framework",
    description: "A utility-first CSS framework for rapidly building custom user interfaces.",
    features: ["Utility classes", "Responsive design", "Customizable", "JIT compiler"],
    color: "bg-cyan-500",
    aliases: ["tailwind", "tailwindcss"],
  },
  "shadcn/ui": {
    name: "shadcn/ui",
    category: "UI Components",
    description:
      "Accessible, customizable React components built on Radix UI and Tailwind CSS, copied into the project so you own the code.",
    features: ["Radix UI primitives", "Tailwind styling", "Accessible by default", "Fully customizable"],
    color: "bg-zinc-700",
    aliases: ["shadcn", "shadcn ui"],
  },
  Bootstrap: {
    name: "Bootstrap",
    category: "CSS Framework",
    description: "A free and open-source CSS framework for responsive, mobile-first front-end web development.",
    features: ["Grid system", "Components", "Responsive utilities", "JavaScript plugins"],
    color: "bg-purple-500",
    aliases: ["bootstrap"],
  },
  JWT: {
    name: "JWT",
    category: "Authentication",
    description: "JSON Web Token - a compact, URL-safe means of representing claims between two parties.",
    features: ["Stateless", "Self-contained", "Secure", "Cross-platform"],
    color: "bg-red-600",
    aliases: ["jwt", "json-web-token"],
  },
  OAuth: {
    name: "OAuth",
    category: "Authorization",
    description: "An open standard for access delegation, commonly used for token-based authentication.",
    features: ["Third-party access", "Secure delegation", "Token-based", "Standardized"],
    color: "bg-blue-700",
    aliases: ["oauth"],
  },
  PWA: {
    name: "PWA",
    category: "Web Technology",
    description:
      "Progressive Web Apps - web applications that use modern web capabilities to deliver app-like experiences.",
    features: ["Offline support", "Push notifications", "App-like interface", "Installable"],
    color: "bg-green-600",
    aliases: ["pwa", "progressive-web-app"],
  },
  HTML: {
    name: "HTML",
    category: "Markup Language",
    description: "HyperText Markup Language for structuring and presenting content on the World Wide Web.",
    features: ["Semantic elements", "Accessibility", "Forms & validation", "Multimedia support"],
    color: "bg-orange-600",
    aliases: ["html", "html5", "hypertext-markup-language"],
  },
  CSS: {
    name: "CSS",
    category: "Styling Language",
    description:
      "Cascading Style Sheets for styling and layouting web pages with modern features and responsive design.",
    features: ["Responsive design", "Flexbox & Grid", "Animations", "Custom properties"],
    color: "bg-blue-600",
    aliases: ["css", "css3", "cascading-style-sheets"],
  },
  PostgreSQL: {
    name: "PostgreSQL",
    category: "Database",
    description: "A powerful, open-source object-relational database system with advanced features and SQL compliance.",
    features: ["ACID compliance", "JSON support", "Advanced indexing", "Extensible"],
    color: "bg-blue-700",
    aliases: ["postgres", "postgresql", "psql"],
  },
  Express: {
    name: "Express",
    category: "Backend Framework",
    description:
      "Fast, unopinionated, minimalist web framework for Node.js, perfect for building APIs and web applications.",
    features: ["Minimal setup", "Middleware support", "Routing", "Template engines"],
    color: "bg-gray-600",
    aliases: ["express", "express.js", "expressjs"],
  },
  MongoDB: {
    name: "MongoDB",
    category: "Database",
    description:
      "A document-based, distributed database built for modern application developers and for the cloud era.",
    features: ["Document storage", "Horizontal scaling", "Flexible schema", "Rich queries"],
    color: "bg-green-600",
    aliases: ["mongodb", "mongo"],
  },
  "Video Streaming": {
    name: "Video Streaming",
    category: "Media Technology",
    description:
      "Technology for delivering video content over the internet with adaptive bitrate and real-time streaming capabilities.",
    features: ["Adaptive bitrate", "Real-time delivery", "Multiple formats", "CDN integration"],
    color: "bg-red-600",
    aliases: ["video-streaming", "streaming", "video-stream"],
  },
  "Socket.io": {
    name: "Socket.io",
    category: "Real-time Communication",
    description: "A library that enables real-time bidirectional event-based communication between client and server.",
    features: ["Real-time messaging", "Auto-reconnection", "Room management", "Fallback support"],
    color: "bg-black",
    aliases: ["socket.io", "socketio", "socket-io"],
  },
  PayPal: {
    name: "PayPal",
    category: "Payment Gateway",
    description:
      "A global online payment system that allows users to send and receive payments securely over the internet.",
    features: ["Global payment processing", "Secure transactions", "Multiple currencies", "Developer APIs"],
    color: "bg-blue-600",
    aliases: ["paypal", "paypal-api"],
  },
  SSLCOMMERZ: {
    name: "SSLCOMMERZ",
    category: "Payment Gateway",
    description:
      "A comprehensive payment gateway solution for Bangladesh, supporting multiple payment methods and currencies.",
    features: ["Local payment methods", "Mobile banking", "Card payments", "Secure processing"],
    color: "bg-green-700",
    aliases: ["sslcommerz", "ssl-commerz", "sslcommerz-payment"],
  },
  "SMS APIs": {
    name: "SMS APIs",
    category: "Communication API",
    description: "Application programming interfaces for sending and receiving SMS messages programmatically.",
    features: ["Bulk messaging", "Delivery reports", "Two-way messaging", "Global coverage"],
    color: "bg-orange-600",
    aliases: ["sms-api", "sms", "text-messaging"],
  },
  "TMDB API": {
    name: "TMDB API",
    category: "External API",
    description:
      "The Movie Database API providing comprehensive movie, TV show, and celebrity information with extensive metadata.",
    features: ["Movie & TV data", "Image galleries", "Search functionality", "Trending content"],
    color: "bg-yellow-600",
    aliases: ["tmdb", "themoviedb", "movie-database"],
  },
  Stripe: {
    name: "Stripe",
    category: "Payment Gateway",
    description:
      "A developer-first payment processing platform for accepting online payments, managing subscriptions, and handling complex billing logic.",
    features: ["Payment processing", "Subscriptions", "Webhooks", "Fraud prevention"],
    color: "bg-indigo-500",
    aliases: ["stripe"],
  },
}

// Skills displayed in the Technical Skills section (with proficiency levels)
export const TECHNICAL_SKILLS = [
  { name: "Next.js", level: 100 },
  { name: "React", level: 100 },
  { name: "React Native", level: 100 },
  { name: "JavaScript", level: 100, hideOnMobile: true },
  { name: "TypeScript", level: 100, hideFromSkills: true },
  { name: "PHP", level: 100, hideOnMobile: true },
  { name: "Laravel", level: 100 },
  { name: "Node.js", level: 100 },
  { name: "MySQL", level: 100 },
  { name: "WordPress", level: 100 },
  { name: "WooCommerce", level: 100, hideOnMobile: true },
  { name: "Sass", level: 100 },
  { name: "Tailwind CSS", level: 100, hideFromSkills: true },
  { name: "shadcn/ui", level: 100, hideFromSkills: true },
  { name: "Vue.js", level: 80, hideOnMobile: true },
  { name: "Ionic", level: 80, hideOnMobile: true },
  { name: "Firebase", level: 80 },
  { name: "Supabase", level: 85 },
  { name: "Stripe", level: 80, hideOnMobile: true },
  { name: "Docker", level: 80 },
  { name: "DevOps", level: 80 },
]

// Legacy exports for backward compatibility
export const TECH_DETAILS = Object.fromEntries(
  Object.entries(TECHNOLOGIES).map(([key, tech]) => [
    key,
    {
      description: tech.description,
      features: tech.features,
    },
  ])
)

export const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/ridwanmalik",
    icon: "github",
    description: "Check out my repositories and open source contributions",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/skridwanmalik",
    icon: "linkedin",
    description: "Connect with me professionally",
  },
  {
    name: "Twitter",
    url: "https://x.com/skridwanmalik",
    icon: "twitter",
    description: "Follow me for tech updates and thoughts",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/skridwanulmalik",
    icon: "instagram",
    description: "See my life behind the code",
  },
  {
    name: "HackerRank",
    url: "https://hackerrank.com/RidwanMalik",
    icon: "hackerrank",
    description: "View my coding challenges and solutions",
  },
]

// Education — shared by the Education section and the generated resume PDF.
//
// `period` uses a plain hyphen, matching the EXPERIENCES entries above. It used to use an
// en dash, and ATS parsers flagged the two different dash characters as inconsistent
// dates. Keep the hyphen on any entry added here.
//
// `resumePeriod` overrides the dates in the PDF only, the same way EXPERIENCES does: the
// real dates overlap (the diploma ran to 2021 while the bachelor's started in 2020), and
// the resume presents them sequentially instead. The website keeps `period`.
//
// The degree is spelled out ("Bachelor of Science", not "B.Sc.") because ATS skill and
// education dictionaries match the full wording far more reliably than the abbreviation.
export const EDUCATION = [
  {
    degree: "Bachelor of Science in Computer Science & Engineering",
    institution: "Bangladesh University of Business and Technology",
    shortName: "BUBT, Dhaka",
    location: "Dhaka",
    period: "2020 - Present",
    resumePeriod: "2021 - Present",
    note: "",
  },
  {
    degree: "Diploma in Computer Engineering",
    institution: "BCMC College of Engineering & Technology",
    shortName: "BCMC College of Engineering & Technology, Jashore",
    location: "Jashore",
    period: "2016 - 2021",
    resumePeriod: "2016 - 2020",
    note: "CGPA 3.8/4",
  },
]

export const SECTION_TITLES = {
  about: "About Me",
  resume: "My Resume",
  technologies: "Technical Skills",
  experience: "Where I've Worked",
  education: "Education",
  projects: "Some Things I've Built",
  certification: "Certifications",
  contact: "Get In Touch",
}

// Helper function to find technology by name or alias
export const findTechnology = (techName: string) => {
  const searchTerm = techName.toLowerCase().replace(/[.,!?;]/g, "")
  return Object.values(TECHNOLOGIES).find(
    tech => tech.name.toLowerCase() === searchTerm || tech.aliases.some(alias => alias.toLowerCase() === searchTerm)
  )
}
