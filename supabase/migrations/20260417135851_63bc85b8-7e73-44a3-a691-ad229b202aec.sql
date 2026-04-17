
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profile (single row)
CREATE TABLE public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin TEXT,
  github TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profile_public_read" ON public.profile FOR SELECT USING (true);
CREATE POLICY "profile_admin_write" ON public.profile FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Education
CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  period TEXT,
  description TEXT,
  coursework TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "education_public_read" ON public.education FOR SELECT USING (true);
CREATE POLICY "education_admin_write" ON public.education FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Experience
CREATE TABLE public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT,
  location TEXT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "experience_public_read" ON public.experience FOR SELECT USING (true);
CREATE POLICY "experience_admin_write" ON public.experience FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  items TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills_public_read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "skills_admin_write" ON public.skills FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  tech_stack TEXT,
  live_url TEXT,
  github_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_public_read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_admin_write" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed data
INSERT INTO public.profile (full_name, title, tagline, bio, email, phone, location, linkedin)
VALUES (
  'Mohamed Arshath',
  'Cloud Specialist',
  'Building secure, scalable cloud infrastructure with a focus on cybersecurity.',
  'Dynamic Computer Science graduate with a keen focus on network security, aiming to harness analytical prowess and technical expertise to fortify cybersecurity frameworks. Currently thriving as an Operator Assistant in the UAE, driven to innovate and secure network infrastructures in cutting-edge tech ecosystems.',
  'nz.arshath@gmail.com',
  '+91 9791986408',
  'Kumbakonam, Thanjavur, Tamil Nadu',
  'https://linkedin.com/in/mohamed-arshath-s-71b166235'
);

INSERT INTO public.education (degree, institution, period, description, coursework, sort_order) VALUES
('Master of Computer Application (MCA)', 'SRM Institute of Science and Technology, Kattankolathur, Tamil Nadu', '2023 — Present', 'Distance Education. Specialising in cloud computing and data analytics with hands-on coursework in modern enterprise tooling.', 'Cloud Computing, Big Data Analytics, Data Visualization, Database Management, AWS, Hadoop, Tableau, SQL', 1),
('Bachelor of Science (BSc), Information Technology', 'Bharathidasan University, Trichy, Tamil Nadu', '2020 — 2023', 'Served as Lab In-Charge: managed computer lab operations, troubleshot hardware issues, and mentored peers on programming and hardware tasks.', 'Programming (Python, Java, C++), Computer Hardware, Software Development, Data Structures, Operating Systems, Physics for Computing', 2);

INSERT INTO public.experience (role, company, period, location, description, sort_order) VALUES
('Operator Assistant', 'Falcon Solution FZ', 'October 2024 — Present', 'Dubai, UAE', 'Maintained accurate client-user records ensuring compliance and seamless communication in aviation support operations. Streamlined documentation processes using CRM tools, reducing processing time by 20%. Collaborated to resolve record discrepancies, improving data accuracy and user satisfaction. Generated reports and archived data to support operational efficiency and stakeholder decisions.', 1);

INSERT INTO public.skills (category, items, sort_order) VALUES
('Programming', 'Java, JavaScript, HTML/CSS', 1),
('Web Development', 'React (Basic), Node.js', 2),
('Cloud Technologies', 'Docker, Kubernetes, AWS', 3),
('Cybersecurity', 'SOC Analyst Fundamentals, Incident Response Basics', 4),
('Tools', 'Git, GitHub', 5),
('Soft Skills', 'Analytical Thinking, Teamwork, Problem-Solving', 6);

INSERT INTO public.projects (title, category, description, tech_stack, live_url, github_url, sort_order) VALUES
('CaterX FoodDash', 'Undergraduate Project', 'A modern food delivery dashboard built as part of the BSc IT programme. Showcases responsive UI patterns and seamless ordering flows.', 'React, TypeScript, Tailwind CSS, Vercel', 'https://caterx-fooddash.vercel.app/', 'https://github.com/nzarshath/caterx-fooddash.git', 1),
('Caption AI', 'Postgraduate Project', 'AI-powered image captioning application built during the MCA programme. Demonstrates integration of machine-learning models with a clean web interface.', 'React, AI/ML, TypeScript, Vercel', 'https://caption-img.vercel.app/', 'https://github.com/nzarshath/caption-ai.git', 2);
