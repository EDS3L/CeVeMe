import React, { useState } from "react";
import { produce } from "immer";
import {
	User,
	Briefcase,
	FileText,
	Code,
	GraduationCap,
	Globe,
	Award,
} from "lucide-react";
import EditableText from "./EditableText";
import CollapsibleSection from "./CollapsibleSection";
import ExperienceSection from "../sections/ExperienceSection";
import SkillsSection from "../sections/SkillsSection";
import EducationSection from "../sections/EducationSection";
import PortfolioSection from "../sections/PortfolioSection";
import CertificatesSection from "../sections/CertificatesSection";

export default function SidebarEditor({ cvData, onDataChange }) {
	const [openSections, setOpenSections] = useState({
		personal: true,
		summary: true,
		experience: true,
		skills: true,
		education: false,
		portfolio: false,
		certificates: false,
	});

	const toggleSection = (section) =>
		setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

	const updateData = (updater) => {
		onDataChange((current) => produce(current, updater));
	};

	return (
		<aside className="flex flex-col gap-4 text-[var(--color-slatedark)]">
			{/* Tytuł zawodowy */}
			<div className="p-3 rounded-md bg-[var(--color-ivorylight)] border border-[color:rgba(0,0,0,0.06)]">
				<EditableText
					value={cvData.headline || ""}
					onChange={(v) =>
						updateData((d) => {
							d.headline = v;
						})
					}
					placeholder="Tytuł zawodowy"
					className="text-base font-semibold"
				/>
			</div>

			{/* Dane osobowe */}
			<CollapsibleSection
				title="Dane osobowe"
				icon={User}
				isOpen={openSections.personal}
				onToggle={() => toggleSection("personal")}
			>
				<div className="space-y-2">
					{[
						{ key: "name", placeholder: "Imię i nazwisko" },
						{ key: "email", placeholder: "Adres e-mail" },
						{ key: "phoneNumber", placeholder: "Numer telefonu" },
						{ key: "city", placeholder: "Miasto" },
					].map(({ key, placeholder }) => (
						<input
							key={key}
							type="text"
							value={cvData.personalData?.[key] || ""}
							onChange={(e) =>
								updateData((d) => {
									d.personalData = d.personalData || {};
									d.personalData[key] = e.target.value;
								})
							}
							placeholder={placeholder}
							className="w-full px-3 py-2 text-sm rounded-md bg-[var(--color-basewhite)]
                         border border-[color:rgba(0,0,0,0.08)]
                         placeholder:text-[var(--color-cloudmedium)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--color-feedbackfocus)]"
						/>
					))}

					{/* Linki */}
					<div className="pt-3">
						<h4 className="text-sm font-semibold text-[var(--color-clouddark)] mb-2">
							Linki
						</h4>
						{cvData.personalData?.links?.map((link, i) => (
							<div key={i} className="flex items-center gap-2 mb-2">
								<input
									type="text"
									value={link.type}
									onChange={(e) =>
										updateData((d) => {
											d.personalData.links[i].type = e.target.value;
										})
									}
									placeholder="Typ (np. LinkedIn)"
									className="flex-1 px-2 py-2 text-xs rounded-md bg-[var(--color-basewhite)]
                             border border-[color:rgba(0,0,0,0.08)]
                             placeholder:text-[var(--color-cloudmedium)]
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-feedbackfocus)]"
								/>
								<input
									type="text"
									value={link.url}
									onChange={(e) =>
										updateData((d) => {
											d.personalData.links[i].url = e.target.value;
										})
									}
									placeholder="URL"
									className="flex-1 px-2 py-2 text-xs rounded-md bg-[var(--color-basewhite)]
                             border border-[color:rgba(0,0,0,0.08)]
                             placeholder:text-[var(--color-cloudmedium)]
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-feedbackfocus)]"
								/>
								<button
									type="button"
									onClick={() =>
										updateData((d) => {
											d.personalData.links.splice(i, 1);
										})
									}
									className="px-2 py-2 text-[12px] rounded-md bg-[var(--color-ivorymedium)]
                             hover:bg-[var(--color-ivorydark)]/60"
								>
									✕
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() =>
								updateData((d) => {
									d.personalData = d.personalData || {};
									d.personalData.links = d.personalData.links || [];
									d.personalData.links.push({ type: "", url: "" });
								})
							}
							className="text-sm font-medium text-[var(--color-bookcloth)] hover:text-[var(--color-kraft)]"
						>
							+ Dodaj link
						</button>
					</div>
				</div>
			</CollapsibleSection>

			{/* Podsumowanie */}
			<CollapsibleSection
				title="Podsumowanie"
				icon={FileText}
				isOpen={openSections.summary}
				onToggle={() => toggleSection("summary")}
			>
				<textarea
					value={cvData.summary || ""}
					onChange={(e) =>
						updateData((d) => {
							d.summary = e.target.value;
						})
					}
					placeholder="Twoje podsumowanie zawodowe..."
					rows={4}
					className="w-full px-3 py-2 text-sm rounded-md bg-[var(--color-basewhite)]
                     border border-[color:rgba(0,0,0,0.08)]
                     placeholder:text-[var(--color-cloudmedium)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-feedbackfocus)]"
				/>
			</CollapsibleSection>

			<ExperienceSection
				experience={cvData.experience}
				updateData={updateData}
				isOpen={openSections.experience}
				onToggle={() => toggleSection("experience")}
			/>

			<SkillsSection
				skills={cvData.skills}
				updateData={updateData}
				isOpen={openSections.skills}
				onToggle={() => toggleSection("skills")}
			/>

			<EducationSection
				education={cvData.educations || cvData.education}
				updateData={updateData}
				isOpen={openSections.education}
				onToggle={() => toggleSection("education")}
			/>

			<PortfolioSection
				portfolio={cvData.portfolio}
				updateData={updateData}
				isOpen={openSections.portfolio}
				onToggle={() => toggleSection("portfolio")}
			/>

			<CertificatesSection
				certificates={cvData.certificates}
				updateData={updateData}
				isOpen={openSections.certificates}
				onToggle={() => toggleSection("certificates")}
			/>
		</aside>
	);
}
