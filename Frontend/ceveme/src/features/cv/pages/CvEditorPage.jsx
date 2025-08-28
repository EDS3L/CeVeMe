import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import { useCvEditor } from "../hooks/useCvEditor";
import CvForm from "../components/CvForm";
import SidebarEditor from "../components/SidebarEditor";
import CVPreviewClassic from "../cvTypes/CVPreviewClassic";
import CVPreviewSidebar from "../cvTypes/CVPreviewSidebar";
import CVPreviewHybrid from "../cvTypes/CVPreviewHybrid";
import CVPreviewProject from "../cvTypes/CVPreviewProject";
import CVPreviewAts from "../cvTypes/CVPreviewAts";
import { useSinglePageScale } from "../hooks/useSinglePageScale";
import LayoutPicker from "../components/LayoutPicker";
import Navbar from "../../../components/Navbar";
import { useLocation } from "react-router-dom";

/* Druk: zero marginesów, overflow hidden TYLKO w druku */
const PAGE_STYLE = `
  @page { size: 210mm 297mm; margin: 0; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    #cv-page {
      width: 210mm; height: 297mm;
      overflow: hidden;
      background: white;
      position: relative;
    }
    #cv-page, #cv-page * {
      box-shadow: none !important;
    }
    .no-print { display: none !important; }
  }
`;

/* Layouty z opisami do pickera */
const LAYOUTS = [
	{
		value: "ats",
		label: "ATS",
		badge: "ATS-first",
		desc: "Jednokolumnowe, reverse-chronological. Zero tabel/ikon, standardowe punkty. Maksymalna zgodność z ATS.",
		component: CVPreviewAts,
	},
	{
		value: "hybrid",
		label: "Hybrid",
		badge: "Human-first · ATS-safe",
		desc: "Dwukolumnowy dla ludzi (skills/języki/certy w bocznej kolumnie), ale DOM linearny i ATS-bezpieczny.",
		component: CVPreviewHybrid,
	},
	{
		value: "project",
		label: "Project/Case",
		badge: "Impact-first",
		desc: "Wybrane projekty i efekty (STAR/CAR) na pierwszym planie. Idealne dla IT/produkt/design i juniorów.",
		component: CVPreviewProject,
	},
	{
		value: "classic",
		label: "Classic",
		desc: "Klasyczny układ z wyraźnym podziałem na doświadczenie, projekty i umiejętności.",
		component: CVPreviewClassic,
	},
	{
		value: "sidebar",
		label: "Sidebar",
		desc: "Zgrabny layout z boczną kolumną na kontakt, skills i certyfikaty.",
		component: CVPreviewSidebar,
	},
];

async function waitForImages(node) {
	if (!node) return;
	const imgs = Array.from(node.querySelectorAll("img"));
	if (!imgs.length) return;
	await Promise.all(
		imgs.map((img) =>
			img.complete
				? Promise.resolve()
				: new Promise((res) => {
						const done = () => {
							img.onload = img.onerror = null;
							res();
						};
						img.onload = done;
						img.onerror = done;
				  })
		)
	);
}
const nextFrame = () => new Promise((r) => requestAnimationFrame(r));

export default function CvEditorPage() {
	const {
		cvData,
		offerLink,
		setOfferLink,
		loading,
		error,
		handleGenerateCv,
		setCvData,
	} = useCvEditor();

	const [layout, setLayout] = useState("classic");
	const location = useLocation();

	const innerRef = useRef(null); // element skalowany
	const pageRef = useRef(null); // element drukowany

	useEffect(() => {
		if (location.state?.offerLink) {
			setOfferLink(location.state.offerLink);
		}
	}, [location.state?.offerLink]);

	useEffect(() => {
		if (offerLink) {
			handleGenerateCv();
		}
	}, [offerLink]);

	const { scale, tx, ty, recomputeNow } = useSinglePageScale(innerRef, {
		widthMm: 210,
		heightMm: 297,
		minF: 1,
		maxF: 4,
		iterations: 14,
	});

	const handlePrint = useReactToPrint({
		contentRef: pageRef,
		copyStyles: true,
		removeAfterPrint: true,
		pageStyle: PAGE_STYLE,
		documentTitle: cvData?.personalData?.name
			? `CV_${cvData.personalData.name.replace(/\s+/g, "_")}`
			: "CV",
		onBeforePrint: async () => {
			await waitForImages(innerRef.current);
			recomputeNow();
			await nextFrame();
			recomputeNow();
			await nextFrame();
		},
	});

	const PreviewComponent =
		LAYOUTS.find((l) => l.value === layout)?.component || CVPreviewClassic;

	return (
		<div className="flex flex-col h-screen bg-[var(--color-ivorylight)] text-[var(--color-slatedark)]">
			<Navbar />

			<div className="flex-1 min-h-0">
				{!cvData ? (
					<div className="max-w-5xl mx-auto p-8">
						<CvForm
							offerLink={offerLink}
							setOfferLink={setOfferLink}
							onGenerate={handleGenerateCv}
							loading={loading}
							error={error}
						/>
					</div>
				) : (
					<div className="h-full flex min-h-0">
						{/* LEWY PANEL: SidebarEditor (stała szerokość + wewnętrzny scroll) */}
						<div className="flex flex-col w-[400px] min-w-[360px] max-w-[440px] bg-[var(--color-ivorymedium)] border-r border-[color:rgba(0,0,0,0.08)]">
							<div className="px-4 py-3 border-b border-[color:rgba(0,0,0,0.06)]">
								<h2 className="text-sm tracking-wide uppercase font-semibold text-[var(--color-clouddark)]">
									Edytor CV
								</h2>
							</div>
							<div className="flex-1 min-h-0 overflow-y-auto">
								<div className="p-4">
									<SidebarEditor cvData={cvData} onDataChange={setCvData} />
								</div>
							</div>
						</div>

						{/* PRAWY PANEL: Pasek akcji + picker + duży podgląd */}
						<div className="flex-1 min-w-0 flex flex-col">
							{/* Sticky toolbar */}
							<div className="sticky top-0 z-10 border-b border-[color:rgba(0,0,0,0.06)] bg-[var(--color-ivorylight)]/90 backdrop-blur">
								<div className="mx-auto max-w-[1400px] px-6 py-4 flex items-start gap-6">
									<div className="flex-1">
										<LayoutPicker
											layouts={LAYOUTS}
											value={layout}
											onChange={setLayout}
											cvData={cvData}
										/>
									</div>
									<div className="shrink-0 flex items-center">
										<button
											onClick={handlePrint}
											disabled={loading || !cvData}
											className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md
                                 bg-[var(--color-bookcloth)] text-[var(--color-basewhite)] font-semibold
                                 shadow-sm hover:bg-[var(--color-kraft)] focus:outline-none
                                 focus:ring-2 focus:ring-[var(--color-feedbackfocus)] disabled:opacity-50"
										>
											{loading ? "Generowanie…" : "Drukuj / PDF"}
										</button>
									</div>
								</div>
							</div>

							{/* Duży podgląd (centrum) */}
							<div className="flex-1 min-h-0 overflow-auto">
								<div className="mx-auto max-w-[1400px] px-6 py-8">
									<div className="flex justify-center">
										<div
											id="cv-page"
											ref={pageRef}
											style={{
												width: "210mm",
												height: "297mm",
												background: "var(--color-basewhite)",
												boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
												position: "relative",
												overflow: "visible",
												borderRadius: 14,
												border: "1px solid rgba(0,0,0,0.04)",
											}}
										>
											<div
												id="cv-print"
												ref={innerRef}
												style={{
													position: "absolute",
													top: 0,
													left: 0,
													transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
													transformOrigin: "top left",
													willChange: "transform",
												}}
											>
												<PreviewComponent cvData={cvData} />
											</div>
										</div>
									</div>

									<p className="text-center text-xs mt-4 text-[var(--color-clouddark)]/70">
										Podgląd dopasowany do A4. Wydruk/PDF zachowuje układ 1×A4.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
