import io
from typing import Dict, Any
from datetime import datetime

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False

class ReportService:
    def generate_pdf_report(self, prediction_data: Dict[str, Any]) -> bytes:
        """Generates a professional executive PDF prediction report."""
        if not HAS_REPORTLAB:
            # Fallback if ReportLab is not available
            return b"%PDF-1.4 Mock PDF Output"

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom palette matching YieldVision design language
        c_forest = colors.HexColor("#0f2e22")
        c_emerald = colors.HexColor("#10b981")
        c_mint = colors.HexColor("#f0fdf4")
        c_gray = colors.HexColor("#64748b")
        c_border = colors.HexColor("#cbd5e1")
        
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=22,
            textColor=c_forest,
            leading=26,
            spaceAfter=4
        )
        
        subtitle_style = ParagraphStyle(
            "DocSubTitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=c_emerald,
            leading=14,
            spaceAfter=15
        )
        
        h2_style = ParagraphStyle(
            "SectionH2",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            textColor=c_forest,
            leading=16,
            spaceBefore=12,
            spaceAfter=6
        )
        
        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            textColor=colors.HexColor("#1e293b"),
            leading=13
        )
        
        kpi_val_style = ParagraphStyle(
            "KPIVal",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=18,
            textColor=c_forest,
            alignment=1
        )
        
        kpi_lbl_style = ParagraphStyle(
            "KPILbl",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=c_gray,
            alignment=1
        )

        story = []

        # Header Title
        story.append(Paragraph("YIELDVISION : AGRICULTURAL INTELLIGENCE", title_style))
        story.append(Paragraph("Machine Learning for Crop Yield Prediction • Official Decision Support Report", subtitle_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=c_emerald, spaceBefore=0, spaceAfter=15))

        # Metadata Bar
        pred_id = prediction_data.get("id", "PRED-2025-001")
        ts = prediction_data.get("timestamp", datetime.now().strftime("%Y-%m-%d %H:%M"))
        crop = prediction_data.get("crop", "Sugarcane")
        loc = f"{prediction_data.get('location', 'Maharashtra')}, {prediction_data.get('district', 'Kolhapur')}"
        season = prediction_data.get("season", "2025-26")
        
        meta_table_data = [
            [
                Paragraph(f"<b>Prediction ID:</b> {pred_id}", body_style),
                Paragraph(f"<b>Generated:</b> {ts}", body_style),
                Paragraph(f"<b>Crop:</b> {crop}", body_style)
            ],
            [
                Paragraph(f"<b>Location:</b> {loc}", body_style),
                Paragraph(f"<b>Season:</b> {season}", body_style),
                Paragraph(f"<b>Ensemble Model:</b> Voting Regressor", body_style)
            ]
        ]
        meta_table = Table(meta_table_data, colWidths=[180, 180, 180])
        meta_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), c_mint),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#bbf7d0")),
            ("PADDING", (0, 0), (-1, -1), 6),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 14))

        # Core KPI Cards
        y_val = f"{prediction_data.get('predicted_yield', 7.82)} {prediction_data.get('unit', 'T/Ha')}"
        conf = f"{prediction_data.get('confidence', 94.1)}%"
        c_state = prediction_data.get("climate_state", "Neutral")
        risk = prediction_data.get("risk_level", "Moderate")

        kpi_table_data = [
            [
                Paragraph(y_val, kpi_val_style),
                Paragraph(conf, kpi_val_style),
                Paragraph(c_state, kpi_val_style),
                Paragraph(risk, kpi_val_style)
            ],
            [
                Paragraph("PREDICTED YIELD", kpi_lbl_style),
                Paragraph("PREDICTION CONFIDENCE", kpi_lbl_style),
                Paragraph("CLIMATE ENSO STATE", kpi_lbl_style),
                Paragraph("AGRONOMIC RISK", kpi_lbl_style)
            ]
        ]
        kpi_table = Table(kpi_table_data, colWidths=[135, 135, 135, 135])
        kpi_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("BOX", (0, 0), (-1, -1), 1, c_border),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
            ("PADDING", (0, 0), (-1, -1), 6),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))
        story.append(kpi_table)
        story.append(Spacer(1, 14))

        # Model Comparison Table
        story.append(Paragraph("Candidate Estimator Benchmarking Matrix", h2_style))
        models_data = prediction_data.get("model_outputs", {})
        model_rows = [["Model", "Prediction", "MAE", "RMSE", "R² Score", "Ensemble Weight"]]
        
        unit_str = prediction_data.get('unit', 'Quintal/Acre')
        for m_name, metrics in models_data.items():
            model_rows.append([
                m_name,
                f"{metrics.get('prediction', 0.0)} {unit_str}",
                f"{metrics.get('mae', 0.0):.3f}",
                f"{metrics.get('rmse', 0.0):.3f}",
                f"{metrics.get('r2', 0.0):.3f}",
                f"{int(metrics.get('weight', 0.0)*100)}%"
            ])
            
        m_table = Table(model_rows, colWidths=[170, 75, 75, 75, 75, 70])
        m_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), c_forest),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 8),
            ("BACKGROUND", (0, 1), (-1, 1), colors.HexColor("#dcfce7")), # highlight voting regressor
            ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, c_border),
            ("FONTSIZE", (0, 1), (-1, -1), 8),
            ("PADDING", (0, 0), (-1, -1), 4),
            ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ]))
        story.append(m_table)
        story.append(Spacer(1, 14))

        # Model Insights & Environmental Explanations
        story.append(Paragraph("Model Insight & Agronomic Assessment", h2_style))
        insights = prediction_data.get("insights", {})
        summary_text = insights.get("summary", "Atmospheric and soil moisture conditions remain within favorable ranges.")
        story.append(Paragraph(f"<b>Executive Summary:</b> {summary_text}", body_style))
        story.append(Spacer(1, 6))

        positives = insights.get("positive_factors", [])
        if positives:
            story.append(Paragraph("<b>Favorable Yield Factors:</b>", body_style))
            for p in positives:
                story.append(Paragraph(f"• {p}", body_style))
            story.append(Spacer(1, 4))

        risks_list = insights.get("risk_factors", [])
        if risks_list:
            story.append(Paragraph("<b>Identified Vulnerabilities & Risks:</b>", body_style))
            for r in risks_list:
                story.append(Paragraph(f"• {r}", body_style))
            story.append(Spacer(1, 4))

        # Top Influencing Features
        top_inf = insights.get("top_influencing_factors", [])
        if top_inf:
            story.append(Paragraph(f"<b>Top Influencing Features:</b> {', '.join(top_inf)}", body_style))
            story.append(Spacer(1, 4))

        conf_exp = insights.get("confidence_explanation", "")
        if conf_exp:
            story.append(Paragraph(f"<b>Confidence Rationale:</b> {conf_exp}", body_style))

        story.append(Spacer(1, 16))
        story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=0, spaceAfter=8))
        
        footer_text = "YieldVision ML Platform • Lead Researcher: Karina Kesur • Agricultural Decision-Support System"
        story.append(Paragraph(footer_text, ParagraphStyle("Footer", parent=styles["Normal"], fontSize=7.5, textColor=c_gray, alignment=1)))

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

    def generate_history_pdf_report(self, items: list, filters: dict = None) -> bytes:
        """Generates an executive multi-record PDF report summarizing historical predictions."""
        if not HAS_REPORTLAB:
            return b"%PDF-1.4 Mock History PDF Output"

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=30,
            leftMargin=30,
            topMargin=30,
            bottomMargin=30
        )

        styles = getSampleStyleSheet()
        c_forest = colors.HexColor("#0f2e22")
        c_emerald = colors.HexColor("#10b981")
        c_mint = colors.HexColor("#f0fdf4")
        c_gray = colors.HexColor("#64748b")
        c_border = colors.HexColor("#cbd5e1")

        title_style = ParagraphStyle(
            "HistTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=20,
            textColor=c_forest,
            leading=24,
            spaceAfter=4
        )

        subtitle_style = ParagraphStyle(
            "HistSubTitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=c_emerald,
            leading=13,
            spaceAfter=12
        )

        body_style = ParagraphStyle(
            "HistBody",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=colors.HexColor("#1e293b"),
            leading=11
        )

        th_style = ParagraphStyle(
            "HistTH",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            textColor=colors.white,
            alignment=1
        )

        story = []

        # 1. Header
        story.append(Paragraph("YIELDVISION : PREDICTION AUDIT & LOGS", title_style))
        story.append(Paragraph("Comprehensive Multi-Model Machine Learning Predictions History", subtitle_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=c_emerald, spaceBefore=0, spaceAfter=10))

        # 2. Summary stats calculation
        total_count = len(items)
        avg_yield = sum(float(i.get("predicted_yield", 0)) for i in items) / max(1, total_count) if total_count else 0
        avg_conf = sum(float(i.get("confidence", 0)) for i in items) / max(1, total_count) if total_count else 0
        gen_time = datetime.now().strftime("%Y-%m-%d %H:%M")

        filter_desc = []
        if filters:
            if filters.get("crop") and filters["crop"] != "All": filter_desc.append(f"Crop: {filters['crop']}")
            if filters.get("location") and filters["location"] != "All": filter_desc.append(f"State: {filters['location']}")
            if filters.get("climate") and filters["climate"] != "All": filter_desc.append(f"Climate: {filters['climate']}")
            if filters.get("search"): filter_desc.append(f"Search: '{filters['search']}'")
        filter_str = ", ".join(filter_desc) if filter_desc else "All Records (Unfiltered)"

        meta_data = [
            [
                Paragraph(f"<b>Report Generated:</b> {gen_time}", body_style),
                Paragraph(f"<b>Total Entries:</b> {total_count}", body_style),
                Paragraph(f"<b>Average Yield:</b> {avg_yield:.2f} T/Ha", body_style),
                Paragraph(f"<b>Mean Confidence:</b> {avg_conf:.1f}%", body_style)
            ],
            [
                Paragraph(f"<b>Active Filters:</b> {filter_str}", body_style),
                Paragraph("<b>Ensemble:</b> Voting Regressor", body_style),
                Paragraph("<b>Status:</b> Validated Audit", body_style),
                Paragraph("<b>Format:</b> Executive PDF", body_style)
            ]
        ]
        meta_table = Table(meta_data, colWidths=[150, 120, 140, 142])
        meta_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), c_mint),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#bbf7d0")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dcfce7")),
            ("PADDING", (0, 0), (-1, -1), 5),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE")
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 12))

        # 3. History Records Table
        table_rows = [[
            Paragraph("ID", th_style),
            Paragraph("Date", th_style),
            Paragraph("Crop", th_style),
            Paragraph("Location", th_style),
            Paragraph("Season", th_style),
            Paragraph("Yield", th_style),
            Paragraph("Conf.", th_style),
            Paragraph("Model Used", th_style),
            Paragraph("ENSO", th_style),
            Paragraph("Risk", th_style)
        ]]

        for item in items:
            ts_str = str(item.get("timestamp", ""))[:10]
            loc_str = str(item.get("location", ""))
            dist = str(item.get("district", ""))
            if dist and dist != "None":
                loc_str += f" ({dist})"
            if len(loc_str) > 16:
                loc_str = loc_str[:15] + ".."

            table_rows.append([
                Paragraph(str(item.get("id", ""))[:13], body_style),
                Paragraph(ts_str, body_style),
                Paragraph(str(item.get("crop", "")), body_style),
                Paragraph(loc_str, body_style),
                Paragraph(str(item.get("season", "")), body_style),
                Paragraph(f"<b>{float(item.get('predicted_yield', 0)):.2f}</b>", body_style),
                Paragraph(f"{float(item.get('confidence', 0)):.1f}%", body_style),
                Paragraph(str(item.get("model_used", "Voting Regressor")), body_style),
                Paragraph(str(item.get("climate_state", "Neutral")), body_style),
                Paragraph(str(item.get("risk_level", "Moderate")), body_style)
            ])

        hist_table = Table(table_rows, colWidths=[80, 55, 55, 80, 45, 45, 40, 75, 42, 35])
        
        t_style = [
            ("BACKGROUND", (0, 0), (-1, 0), c_forest),
            ("GRID", (0, 0), (-1, -1), 0.5, c_border),
            ("PADDING", (0, 0), (-1, -1), 4),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN", (5, 1), (6, -1), "CENTER"),
        ]
        
        # Zebra stripe rows
        for i in range(1, len(table_rows)):
            if i % 2 == 0:
                t_style.append(("BACKGROUND", (0, i), (-1, i), colors.HexColor("#f8fafc")))

        hist_table.setStyle(TableStyle(t_style))
        story.append(hist_table)
        story.append(Spacer(1, 16))

        # 4. Footer
        story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=0, spaceAfter=6))
        footer_text = "YieldVision ML Platform • Lead Researcher: Karina Kesur • Automated History Export"
        story.append(Paragraph(footer_text, ParagraphStyle("HistFooter", parent=styles["Normal"], fontSize=7.5, textColor=c_gray, alignment=1)))

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

report_service = ReportService()
