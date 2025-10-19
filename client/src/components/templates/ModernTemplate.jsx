import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
	const formatDate = (dateStr) => {
		if (!dateStr) return "";
		const [year, month] = dateStr.split("-");
		return new Date(year, month - 1).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
		});
	};

	const fullName = data.personal_info?.full_name || "Your Name";
	const title = data.personal_info?.headline || data.professional_summary?.split("\n")[0] || "Professional Summary";

	return (
		<div className="max-w-4xl mx-auto bg-white text-gray-800 shadow-md">
			<div className="grid grid-cols-1 md:grid-cols-3">
				{/* Left column - contact & skills */}
				<aside className="md:col-span-1 bg-gray-50 p-6 flex flex-col gap-6" aria-label="Contact and skills">
					<div>
						<h1 className="text-2xl font-semibold text-gray-900">{fullName}</h1>
						{data.personal_info?.headline && (
							<p className="text-sm text-gray-600 mt-1">{data.personal_info.headline}</p>
						)}
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-700 mb-2">Contact</h3>
						<div className="flex flex-col gap-2 text-sm text-gray-600">
							{data.personal_info?.email && (
								<div className="flex items-center gap-2">
									<Mail className="size-4" />
									<a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
								</div>
							)}
							{data.personal_info?.phone && (
								<div className="flex items-center gap-2">
									<Phone className="size-4" />
									<span>{data.personal_info.phone}</span>
								</div>
							)}
							{data.personal_info?.location && (
								<div className="flex items-center gap-2">
									<MapPin className="size-4" />
									<span>{data.personal_info.location}</span>
								</div>
							)}
							{data.personal_info?.linkedin && (
								<a target="_blank" rel="noreferrer" href={data.personal_info.linkedin} className="flex items-center gap-2 hover:underline">
									<Linkedin className="size-4" />
									<span className="break-all text-xs">{data.personal_info.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
								</a>
							)}
							{data.personal_info?.website && (
								<a target="_blank" rel="noreferrer" href={data.personal_info.website} className="flex items-center gap-2 hover:underline">
									<Globe className="size-4" />
									<span className="break-all text-xs">{data.personal_info.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
								</a>
							)}
						</div>
					</div>

					{data.skills && data.skills.length > 0 && (
						<div>
							<h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
							<div className="flex flex-wrap gap-2">
								{data.skills.map((skill, index) => (
									<span
										key={index}
										className="px-3 py-1 text-sm text-white rounded-full"
										style={{ backgroundColor: accentColor }}
									>
										{skill}
									</span>
								))}
							</div>
						</div>
					)}

					<div className="mt-auto text-xs text-gray-500">
						Designed &amp; crafted by <strong>Maaz Ansari</strong>
					</div>
				</aside>

				{/* Right column - main content */}
				<main className="md:col-span-2 p-8">
					<header className="mb-6">
						<h2 className="text-lg text-gray-700 font-medium">{title}</h2>
						{data.professional_summary && (
							<p className="mt-3 text-gray-700 whitespace-pre-line">{data.professional_summary}</p>
						)}
					</header>

					{/* Experience */}
					{data.experience && data.experience.length > 0 && (
						<section className="mb-8">
							<h3 className="text-xl font-semibold mb-4">Experience</h3>
							<div className="space-y-6">
								{data.experience.map((exp, index) => (
									<div key={index} className="relative">
										<div className="flex justify-between items-start">
											<div>
												<h4 className="text-lg font-medium text-gray-900">{exp.position}</h4>
												<p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>
											</div>
											<div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
												{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
											</div>
										</div>
										{exp.description && (
											<div className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line">
												{exp.description}
											</div>
										)}
									</div>
								))}
							</div>
						</section>
					)}

					{/* Projects */}
					{data.project && data.project.length > 0 && (
						<section className="mb-8">
							<h3 className="text-xl font-semibold mb-4">Projects</h3>
							<div className="space-y-4">
								{data.project.map((p, index) => (
									<div key={index}>
										<h4 className="text-md font-medium text-gray-900">{p.name}</h4>
										{p.description && (
											<div className="text-gray-700 text-sm mt-2 whitespace-pre-line">{p.description}</div>
										)}
									</div>
								))}
							</div>
						</section>
					)}

					<div className="grid sm:grid-cols-2 gap-8">
						{/* Education */}
						{data.education && data.education.length > 0 && (
							<section>
								<h3 className="text-lg font-semibold mb-4">Education</h3>
								<div className="space-y-4 text-sm text-gray-700">
									{data.education.map((edu, index) => (
										<div key={index}>
											<h4 className="font-medium text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
											<p style={{ color: accentColor }}>{edu.institution}</p>
											<div className="flex justify-between items-center text-xs text-gray-600 mt-1">
												<span>{formatDate(edu.graduation_date)}</span>
												{edu.gpa && <span>GPA: {edu.gpa}</span>}
											</div>
										</div>
									))}
								</div>
							</section>
						)}

						{/* Sidebar duplicates skills if large screens; otherwise it's fine */}
						{data.skills && data.skills.length > 0 && (
							<section>
								<h3 className="text-lg font-semibold mb-4">Skills</h3>
								<div className="flex flex-wrap gap-2">
									{data.skills.map((skill, index) => (
										<span key={index} className="px-3 py-1 text-sm text-white rounded-full" style={{ backgroundColor: accentColor }}>{skill}</span>
									))}
								</div>
							</section>
						)}
					</div>
				</main>
			</div>
		</div>
	);
};

export default ModernTemplate;