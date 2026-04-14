"""Erzeugt realistische Beispiel-Gutachter-Dokumente als PDF + Bilder."""

from fpdf import FPDF
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.dirname(os.path.abspath(__file__))


def heading(pdf: FPDF, text: str):
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 12, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)


def subheading(pdf: FPDF, text: str):
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 8, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)


def body(pdf: FPDF, text: str):
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 5, text)
    pdf.ln(2)


def table_row(pdf: FPDF, label: str, value: str):
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(65, 6, label, border=1)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, value, border=1, new_x="LMARGIN", new_y="NEXT")


def separator(pdf: FPDF):
    pdf.ln(4)
    pdf.set_draw_color(180, 180, 180)
    pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
    pdf.ln(4)


# ---------------------------------------------------------------------------
# 1. Grundbuchauszug
# ---------------------------------------------------------------------------
def create_grundbuchauszug():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=20)

    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(0, 5, "Amtsgericht Frankfurt am Main  |  Grundbuchamt", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    heading(pdf, "Grundbuchauszug (beglaubigte Abschrift)")
    pdf.ln(2)

    subheading(pdf, "I. Bestandsverzeichnis")
    table_row(pdf, "Grundbuch von", "Frankfurt-Sachsenhausen")
    table_row(pdf, "Band / Blatt", "Band 142, Blatt 3891")
    table_row(pdf, "Gemarkung", "Sachsenhausen")
    table_row(pdf, "Flur", "17")
    table_row(pdf, "Flurstueck", "284/3")
    table_row(pdf, "Lage", "Musterstrasse 12, 60594 Frankfurt am Main")
    table_row(pdf, "Groesse", "487 m2")
    table_row(pdf, "Wirtschaftsart", "Gebaeude- und Freiflaeche")

    separator(pdf)

    subheading(pdf, "II. Abteilung (Lasten und Beschraenkungen)")
    body(pdf, "Lfd. Nr. 1: Grunddienstbarkeit (Leitungsrecht) zugunsten der Mainova AG, "
         "eingetragen am 14.03.1998, Bezug: UR-Nr. 1247/1998 Notar Dr. Weber, Frankfurt.")
    body(pdf, "Lfd. Nr. 2: Beschraenkte persoenliche Dienstbarkeit (Wohnrecht) fuer "
         "Margarethe Kellner, geb. 22.04.1943, eingetragen am 08.11.2005.")

    separator(pdf)

    subheading(pdf, "III. Abteilung (Hypotheken, Grundschulden, Rentenschulden)")
    body(pdf, "Lfd. Nr. 1: Grundschuld ohne Brief zu EUR 320.000,00 nebst 15 % Jahreszinsen "
         "fuer die Frankfurter Sparkasse 1822, eingetragen am 22.06.2018, "
         "Bezug: UR-Nr. 0871/2018 Notar Schilling, Frankfurt.")

    separator(pdf)

    subheading(pdf, "Eigentuemer (Abteilung I)")
    body(pdf, "Thomas Reinhardt und Claudia Reinhardt, geb. Becker, "
         "zu je 1/2 Miteigentumsanteil.\n"
         "Eingetragen aufgrund Auflassung vom 15.05.2018, "
         "Eintragung am 22.06.2018.")

    pdf.ln(10)
    pdf.set_font("Helvetica", "I", 8)
    pdf.cell(0, 5, "Dieser Ausdruck ist maschinell erstellt und ohne Unterschrift gueltig.", align="C")

    pdf.output(os.path.join(OUT, "Grundbuchauszug_Musterstrasse_12.pdf"))


# ---------------------------------------------------------------------------
# 2. Lageplan / Flurkarte
# ---------------------------------------------------------------------------
def create_lageplan():
    pdf = FPDF()
    pdf.add_page("L")

    heading(pdf, "Auszug aus der Liegenschaftskarte")
    pdf.set_font("Helvetica", "", 10)

    table_row(pdf, "Gemarkung", "Sachsenhausen")
    table_row(pdf, "Flur", "17")
    table_row(pdf, "Flurstueck", "284/3")
    table_row(pdf, "Massstab", "1 : 500")
    table_row(pdf, "Stand der Karte", "12.01.2025")

    pdf.ln(8)

    # Simplified plot drawing
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.5)
    ox, oy = 40, 90
    # Property boundary
    pdf.rect(ox, oy, 120, 80)
    # Building footprint
    pdf.set_fill_color(220, 220, 220)
    pdf.rect(ox + 20, oy + 15, 60, 45, "FD")
    # Labels
    pdf.set_font("Helvetica", "", 7)
    pdf.text(ox + 35, oy + 40, "Wohngebaeude")
    pdf.text(ox + 35, oy + 46, "Bj. 1962 / san. 2018")
    pdf.text(ox + 50, oy - 3, "Musterstrasse")
    pdf.set_font("Helvetica", "B", 9)
    pdf.text(ox + 85, oy + 75, "284/3")
    pdf.text(ox + 85, oy + 80, "487 m2")

    # Compass rose
    pdf.set_font("Helvetica", "B", 10)
    pdf.text(ox + 140, oy + 10, "N")
    pdf.line(ox + 143, oy + 13, ox + 143, oy + 30)
    pdf.line(ox + 140, oy + 16, ox + 143, oy + 13)
    pdf.line(ox + 146, oy + 16, ox + 143, oy + 13)

    # Neighboring plots
    pdf.set_font("Helvetica", "", 7)
    pdf.text(ox - 30, oy + 40, "283/1")
    pdf.text(ox + 130, oy + 40, "285/2")

    pdf.ln(100)
    pdf.set_font("Helvetica", "I", 8)
    pdf.cell(0, 5, "Kataster- und Vermessungsamt Frankfurt am Main | Datenquelle: ALKIS", align="C")

    pdf.output(os.path.join(OUT, "Flurkarte_Flurstueck_284-3.pdf"))


# ---------------------------------------------------------------------------
# 3. Grundriss EG
# ---------------------------------------------------------------------------
def create_grundriss_eg():
    pdf = FPDF()
    pdf.add_page("L")

    heading(pdf, "Grundriss Erdgeschoss - Musterstrasse 12")
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 5, "Massstab: 1:100  |  Baujahr: 1962  |  Sanierung: 2018", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    ox, oy = 30, 60
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.6)

    # Outer walls
    pdf.rect(ox, oy, 140, 90)

    # Inner walls
    pdf.line(ox + 70, oy, ox + 70, oy + 90)           # vertical center
    pdf.line(ox, oy + 50, ox + 70, oy + 50)            # horizontal left
    pdf.line(ox + 70, oy + 40, ox + 140, oy + 40)      # horizontal right

    # Room labels
    pdf.set_font("Helvetica", "", 8)
    rooms = [
        (ox + 15, oy + 22, "Wohnzimmer", "28,4 m2"),
        (ox + 15, oy + 68, "Kueche", "14,2 m2"),
        (ox + 90, oy + 18, "Schlafzimmer", "18,7 m2"),
        (ox + 90, oy + 60, "Bad / WC", "8,3 m2"),
    ]
    for x, y, name, area in rooms:
        pdf.set_font("Helvetica", "B", 8)
        pdf.text(x, y, name)
        pdf.set_font("Helvetica", "", 7)
        pdf.text(x, y + 5, area)

    # Entry
    pdf.set_font("Helvetica", "", 7)
    pdf.text(ox + 60, oy + 93, "Eingang")

    # Dimensions
    pdf.set_font("Helvetica", "", 7)
    pdf.text(ox + 60, oy - 4, "14,00 m")
    pdf.set_font("Helvetica", "", 7)
    pdf.text(ox - 18, oy + 45, "9,00 m")

    pdf.ln(100)
    pdf.set_font("Helvetica", "", 8)
    pdf.cell(0, 5, "Wohnflaeche EG gesamt: 69,6 m2  |  Lichte Raumhoehe: 2,55 m", align="C")

    pdf.output(os.path.join(OUT, "Grundriss_EG_Musterstrasse_12.pdf"))


# ---------------------------------------------------------------------------
# 4. Grundriss OG
# ---------------------------------------------------------------------------
def create_grundriss_og():
    pdf = FPDF()
    pdf.add_page("L")

    heading(pdf, "Grundriss Obergeschoss - Musterstrasse 12")
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 5, "Massstab: 1:100  |  Baujahr: 1962  |  Sanierung: 2018", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    ox, oy = 30, 60
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.6)

    pdf.rect(ox, oy, 140, 90)
    pdf.line(ox + 55, oy, ox + 55, oy + 90)
    pdf.line(ox + 55, oy + 50, ox + 140, oy + 50)
    pdf.line(ox + 100, oy + 50, ox + 100, oy + 90)

    rooms = [
        (ox + 10, oy + 40, "Kinderzimmer 1", "22,1 m2"),
        (ox + 70, oy + 22, "Kinderzimmer 2", "16,8 m2"),
        (ox + 70, oy + 65, "Gaestezimmer", "12,4 m2"),
        (ox + 108, oy + 65, "Duschbad", "6,9 m2"),
    ]
    for x, y, name, area in rooms:
        pdf.set_font("Helvetica", "B", 8)
        pdf.text(x, y, name)
        pdf.set_font("Helvetica", "", 7)
        pdf.text(x, y + 5, area)

    pdf.set_font("Helvetica", "", 7)
    pdf.text(ox + 20, oy + 85, "Treppenaufgang")

    pdf.ln(100)
    pdf.set_font("Helvetica", "", 8)
    pdf.cell(0, 5, "Wohnflaeche OG gesamt: 58,2 m2  |  Lichte Raumhoehe: 2,45 m", align="C")

    pdf.output(os.path.join(OUT, "Grundriss_OG_Musterstrasse_12.pdf"))


# ---------------------------------------------------------------------------
# 5. Wohnflaechenberechnung
# ---------------------------------------------------------------------------
def create_wohnflaechenberechnung():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=20)

    heading(pdf, "Wohnflaechenberechnung nach WoFlV")
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 5, "Objekt: Musterstrasse 12, 60594 Frankfurt am Main", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "Berechnung gem. Wohnflaechenverordnung (WoFlV) vom 25.11.2003", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    subheading(pdf, "Erdgeschoss")
    header = [("Raum", 55), ("Laenge m", 22), ("Breite m", 22), ("Flaeche m2", 25), ("Faktor", 18), ("Wohnfl. m2", 25)]
    pdf.set_font("Helvetica", "B", 9)
    for label, w in header:
        pdf.cell(w, 7, label, border=1)
    pdf.ln()

    eg_rooms = [
        ("Wohnzimmer", "7,10", "4,00", "28,40", "1,00", "28,40"),
        ("Kueche", "4,10", "3,46", "14,19", "1,00", "14,19"),
        ("Schlafzimmer", "5,50", "3,40", "18,70", "1,00", "18,70"),
        ("Bad / WC", "3,20", "2,60", "8,32", "1,00", "8,32"),
        ("Flur / Diele", "4,80", "1,80", "8,64", "1,00", "8,64"),
    ]

    pdf.set_font("Helvetica", "", 9)
    for row in eg_rooms:
        for i, (_, w) in enumerate(header):
            pdf.cell(w, 6, row[i], border=1)
        pdf.ln()

    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(124, 7, "Summe EG", border=1)
    pdf.cell(43, 7, "78,25", border=1, new_x="LMARGIN", new_y="NEXT")

    separator(pdf)

    subheading(pdf, "Obergeschoss")
    pdf.set_font("Helvetica", "B", 9)
    for label, w in header:
        pdf.cell(w, 7, label, border=1)
    pdf.ln()

    og_rooms = [
        ("Kinderzimmer 1", "5,50", "4,02", "22,11", "1,00", "22,11"),
        ("Kinderzimmer 2", "4,80", "3,50", "16,80", "1,00", "16,80"),
        ("Gaestezimmer", "4,00", "3,10", "12,40", "1,00", "12,40"),
        ("Duschbad", "2,80", "2,46", "6,89", "1,00", "6,89"),
        ("Flur OG", "3,60", "1,60", "5,76", "1,00", "5,76"),
    ]

    pdf.set_font("Helvetica", "", 9)
    for row in og_rooms:
        for i, (_, w) in enumerate(header):
            pdf.cell(w, 6, row[i], border=1)
        pdf.ln()

    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(124, 7, "Summe OG", border=1)
    pdf.cell(43, 7, "63,96", border=1, new_x="LMARGIN", new_y="NEXT")

    separator(pdf)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(124, 10, "Gesamtwohnflaeche", border=1)
    pdf.cell(43, 10, "142,21 m2", border=1, new_x="LMARGIN", new_y="NEXT")

    pdf.ln(8)
    pdf.set_font("Helvetica", "I", 8)
    body(pdf, "Hinweis: Kellergeschoss und Garage sind nicht in der Wohnflaechenberechnung enthalten. "
         "Balkone und Terrassen gemaess WoFlV mit Faktor 0,25 beruecksichtigt (hier: nicht vorhanden).")

    pdf.output(os.path.join(OUT, "Wohnflaechenberechnung_Musterstrasse_12.pdf"))


# ---------------------------------------------------------------------------
# 6. Energieausweis
# ---------------------------------------------------------------------------
def create_energieausweis():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=20)

    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(0, 5, "ENERGIEAUSWEIS fuer Wohngebaeude", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "gemaess Gebaeudeenergiegesetz (GEG)", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    heading(pdf, "Energieausweis - Bedarfsausweis")

    subheading(pdf, "Gebaeudedaten")
    table_row(pdf, "Adresse", "Musterstrasse 12, 60594 Frankfurt am Main")
    table_row(pdf, "Gebaeudetyp", "Freistehendes Einfamilienhaus")
    table_row(pdf, "Baujahr Gebaeude", "1962")
    table_row(pdf, "Baujahr Heizung", "2018 (Brennwertkessel Gas)")
    table_row(pdf, "Gebaeudenutzflaeche AN", "186,4 m2")
    table_row(pdf, "Registriernummer", "HE-2024-00847291")
    table_row(pdf, "Gueltig bis", "14.03.2034")

    separator(pdf)

    subheading(pdf, "Energetische Bewertung")
    table_row(pdf, "Endenergiebedarf", "127,4 kWh/(m2*a)")
    table_row(pdf, "Primaerenergiebedarf", "141,8 kWh/(m2*a)")
    table_row(pdf, "Energieeffizienzklasse", "D")
    table_row(pdf, "Wesentlicher Energietraeger", "Erdgas")
    table_row(pdf, "CO2-Emissionen", "32,6 kg/(m2*a)")

    separator(pdf)

    # Simplified energy scale bar
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 8, "Energieskala (kWh/m2a)", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    colors = [
        (0, 128, 0), (80, 160, 0), (160, 200, 0), (220, 220, 0),
        (255, 200, 0), (255, 160, 0), (255, 100, 0), (255, 50, 0), (200, 0, 0),
    ]
    labels = ["A+", "A", "B", "C", "D", "E", "F", "G", "H"]
    bar_x = pdf.l_margin
    bar_w = (pdf.w - pdf.l_margin - pdf.r_margin) / 9

    for i, ((r, g, b), label) in enumerate(zip(colors, labels)):
        pdf.set_fill_color(r, g, b)
        x = bar_x + i * bar_w
        pdf.rect(x, pdf.get_y(), bar_w, 8, "F")
        pdf.set_font("Helvetica", "B", 7)
        pdf.set_text_color(255, 255, 255) if i > 4 else pdf.set_text_color(0, 0, 0)
        pdf.text(x + bar_w / 2 - 3, pdf.get_y() + 5.5, label)

    # Marker for class D
    pdf.set_text_color(0, 0, 0)
    marker_x = bar_x + 4 * bar_w + bar_w / 2
    pdf.set_font("Helvetica", "B", 14)
    pdf.text(marker_x - 3, pdf.get_y() + 16, "^")

    pdf.ln(22)

    separator(pdf)

    subheading(pdf, "Empfehlungen zur Modernisierung")
    body(pdf, "1. Daemmung der Kellerdecke (ca. 8-12 kWh/m2a Einsparung)\n"
         "2. Austausch der Fenster im EG (Baujahr 1998, Ug-Wert 1,3 W/m2K) "
         "gegen Dreifachverglasung (Ug 0,6 W/m2K)\n"
         "3. Hydraulischer Abgleich der Heizungsanlage\n"
         "4. Pruefung Eignung Waermepumpe bei naechstem Heizungstausch")

    pdf.set_font("Helvetica", "I", 8)
    pdf.cell(0, 5, "Erstellt am 14.03.2024 durch Dipl.-Ing. Markus Hoffmann, Energieberater (BAFA)", align="C")

    pdf.output(os.path.join(OUT, "Energieausweis_Musterstrasse_12.pdf"))


# ---------------------------------------------------------------------------
# 7. Mietvertrag (Sonstiges)
# ---------------------------------------------------------------------------
def create_mietvertrag():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=20)

    heading(pdf, "Mietvertrag ueber Wohnraum")
    pdf.ln(2)

    body(pdf, "Zwischen\n"
         "Thomas Reinhardt und Claudia Reinhardt (Vermieter)\n"
         "Musterstrasse 12, 60594 Frankfurt am Main\n\n"
         "und\n\n"
         "Dr. Florian Bergmann (Mieter)\n"
         "bisher: Schillerstrasse 47, 60313 Frankfurt am Main")

    separator(pdf)

    subheading(pdf, "Par. 1 Mietgegenstand")
    body(pdf, "Vermietet wird die Wohnung im Erdgeschoss des Hauses Musterstrasse 12, "
         "60594 Frankfurt am Main, bestehend aus:\n"
         "- 2 Zimmern, Kueche, Bad/WC, Flur\n"
         "- Wohnflaeche: ca. 69,6 m2\n"
         "- Kellerabteil Nr. 2\n"
         "- 1 PKW-Stellplatz (Hofflaeche)")

    subheading(pdf, "Par. 2 Mietzeit")
    body(pdf, "Das Mietverhaeltnis beginnt am 01.04.2023 und laeuft auf unbestimmte Zeit. "
         "Die gesetzlichen Kuendigungsfristen gelten.")

    subheading(pdf, "Par. 3 Miete und Nebenkosten")
    table_row(pdf, "Kaltmiete (monatlich)", "EUR 1.180,00")
    table_row(pdf, "Nebenkostenvorauszahlung", "EUR 220,00")
    table_row(pdf, "Heizkostenvorauszahlung", "EUR 130,00")
    table_row(pdf, "Gesamtmiete (monatlich)", "EUR 1.530,00")
    pdf.ln(4)
    table_row(pdf, "Kaution (3 Kaltmieten)", "EUR 3.540,00")

    separator(pdf)

    subheading(pdf, "Par. 4 Zustand der Wohnung")
    body(pdf, "Die Wohnung wird in renoviertem Zustand uebergeben. "
         "Schoenscheitsreparaturen gehen waehrend der Mietzeit zu Lasten des Mieters, "
         "sofern ein individueller Fristenplan vereinbart wurde (s. Anlage).\n\n"
         "Bodenbelaege: Eichenparkett (Wohnzimmer, Schlafzimmer), Fliesen (Kueche, Bad).\n"
         "Heizung: Gaszentralheizung mit Brennwerttechnik (Bj. 2018).\n"
         "Fenster: Kunststofffenster, 2-fach verglast (Bj. 1998).")

    pdf.ln(10)
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 5, "Frankfurt am Main, den 18.03.2023", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(12)
    pdf.cell(80, 5, "________________________")
    pdf.cell(10, 5, "")
    pdf.cell(80, 5, "________________________", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 8)
    pdf.cell(80, 5, "Vermieter")
    pdf.cell(10, 5, "")
    pdf.cell(80, 5, "Mieter")

    pdf.output(os.path.join(OUT, "Mietvertrag_Wohnung_EG.pdf"))


# ---------------------------------------------------------------------------
# 8. Baubeschreibung (Sonstiges)
# ---------------------------------------------------------------------------
def create_baubeschreibung():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=20)

    heading(pdf, "Baubeschreibung")
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 5, "Objekt: Musterstrasse 12, 60594 Frankfurt am Main", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    subheading(pdf, "1. Allgemeine Angaben")
    table_row(pdf, "Objektart", "Freistehendes Einfamilienhaus")
    table_row(pdf, "Baujahr", "1962")
    table_row(pdf, "Letzte Sanierung", "2018 (Teilmodernisierung)")
    table_row(pdf, "Geschosse", "EG + OG + nicht ausgebautes DG")
    table_row(pdf, "Unterkellerung", "Vollunterkellert")
    table_row(pdf, "Grundstuecksflaeche", "487 m2")
    table_row(pdf, "Wohnflaeche", "ca. 142 m2")
    table_row(pdf, "Nutzflaeche Keller", "ca. 62 m2")

    separator(pdf)

    subheading(pdf, "2. Konstruktion und Bauweise")
    body(pdf, "Gruendung: Streifenfundamente, Stahlbeton\n"
         "Aussenmauern: Zweischaliges Mauerwerk, Kalksandstein 24 cm + 6 cm Luftschicht + "
         "Klinkerverblender, nachtraeglich Kerndaemmung (2018, WLG 035)\n"
         "Innenmauern: Kalksandstein 11,5 cm und 17,5 cm\n"
         "Geschossdecken: Stahlbetondecken 18 cm\n"
         "Dachkonstruktion: Satteldach, Neigung 38 Grad, Holzkonstruktion, "
         "Betondachsteine (erneuert 2004)\n"
         "Dachdaemmung: Zwischensparrendaemmung 16 cm Mineralwolle (2018)")

    subheading(pdf, "3. Ausbau und Ausstattung")
    body(pdf, "Fenster: Kunststofffenster, 2-fach-Isolierverglasung, Ug 1,3 (EG: Bj. 1998, "
         "OG: Bj. 2018 mit Ug 0,7)\n"
         "Haustuer: Aluminium, waermegedaemmt (2018)\n"
         "Bodenbelaege: EG Eichenparkett / Fliesen, OG Laminat / Fliesen\n"
         "Sanitaer EG: Badewanne, WC, Waschtisch (Ausstattung 2018)\n"
         "Sanitaer OG: Dusche bodengleich, WC, Waschtisch (2018)\n"
         "Elektroinstallation: Teilweise erneuert 2018, Sicherungskasten neu")

    subheading(pdf, "4. Haustechnik")
    body(pdf, "Heizung: Gas-Brennwerttherme Viessmann Vitodens 200-W (2018), 19 kW, "
         "Warmwasserbereitung integriert ueber 300l Schichtladespeicher\n"
         "Heizkoerper: EG Flachheizkoerper (2018), OG Gliederheizkoerper (Bestand)\n"
         "Lueftung: Fensterlueftung, Bad EG mit Abluftventilator\n"
         "Elektro: 3-Phasen-Anschluss, FI-Schutzschalter, Glasfaseranschluss vorhanden")

    subheading(pdf, "5. Aussenanlagen")
    body(pdf, "Zufahrt: Betonsteinpflaster\n"
         "Einfriedung: Zaun mit Hecke (Liguster), ca. 1,20 m Hoehe\n"
         "Garage: Keine, 2 PKW-Stellplaetze auf dem Grundstueck\n"
         "Garten: Rasenflaeche ca. 180 m2, Terrasse Betonplatten ca. 18 m2")

    pdf.output(os.path.join(OUT, "Baubeschreibung_Musterstrasse_12.pdf"))


# ---------------------------------------------------------------------------
# 9. Objektfotos (JPG-Bilder mit Beschriftung)
# ---------------------------------------------------------------------------
def create_objektfotos():
    photos = [
        ("Foto_Aussenansicht_Front.jpg", "Aussenansicht Front", (180, 195, 210)),
        ("Foto_Aussenansicht_Garten.jpg", "Aussenansicht Gartenseite", (170, 200, 170)),
        ("Foto_Wohnzimmer_EG.jpg", "Wohnzimmer EG", (225, 215, 195)),
        ("Foto_Bad_EG.jpg", "Bad Erdgeschoss", (210, 220, 230)),
        ("Foto_Fassade_Riss_Detail.jpg", "Fassadenriss Nordseite", (200, 190, 185)),
    ]

    for filename, label, bg_color in photos:
        img = Image.new("RGB", (1200, 900), bg_color)
        draw = ImageDraw.Draw(img)

        # Simulate a photo with geometric shapes
        draw.rectangle([100, 100, 1100, 800], outline=(120, 120, 120), width=2)

        # Draw some structural elements depending on type
        if "Front" in label:
            # House shape
            draw.rectangle([350, 350, 850, 700], fill=(215, 205, 190), outline=(100, 100, 100), width=2)
            draw.polygon([(300, 350), (600, 180), (900, 350)], fill=(165, 80, 60), outline=(100, 100, 100))
            draw.rectangle([420, 400, 520, 530], outline=(100, 100, 100), width=2)
            draw.rectangle([680, 400, 780, 530], outline=(100, 100, 100), width=2)
            draw.rectangle([550, 550, 650, 700], fill=(140, 110, 80), outline=(100, 100, 100), width=2)
        elif "Garten" in label:
            draw.rectangle([200, 300, 1000, 700], fill=(210, 200, 185), outline=(100, 100, 100), width=2)
            draw.rectangle([300, 600, 900, 700], fill=(180, 175, 165), outline=(100, 100, 100))
            # Windows
            for x in range(350, 900, 180):
                draw.rectangle([x, 380, x + 100, 500], outline=(100, 100, 100), width=2)
        elif "Wohnzimmer" in label:
            draw.rectangle([150, 650, 1050, 800], fill=(190, 160, 120))
            draw.rectangle([200, 200, 500, 600], outline=(140, 140, 140), width=2)
            draw.rectangle([700, 350, 1000, 650], fill=(180, 170, 155), outline=(120, 120, 120), width=2)
        elif "Bad" in label:
            draw.rectangle([150, 650, 1050, 800], fill=(200, 210, 215))
            draw.rectangle([200, 300, 500, 600], fill=(230, 235, 240), outline=(150, 150, 150), width=2)
            draw.ellipse([700, 350, 1000, 550], outline=(150, 150, 150), width=2)
        elif "Riss" in label:
            # Crack pattern
            points = [(500, 250), (510, 320), (495, 400), (515, 480), (505, 560), (520, 640)]
            for j in range(len(points) - 1):
                draw.line([points[j], points[j + 1]], fill=(80, 60, 50), width=3)
            draw.rectangle([300, 200, 700, 700], outline=(150, 140, 130), width=1)

        # Label bar at bottom
        draw.rectangle([0, 820, 1200, 900], fill=(40, 40, 40))

        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
            font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18)
        except (OSError, IOError):
            font = ImageFont.load_default()
            font_small = font

        draw.text((40, 835), label, fill=(255, 255, 255), font=font)
        draw.text((40, 870), "Musterstrasse 12 | 12.02.2025", fill=(180, 180, 180), font=font_small)

        img.save(os.path.join(OUT, filename), "JPEG", quality=85)


# ---------------------------------------------------------------------------

if __name__ == "__main__":
    create_grundbuchauszug()
    create_lageplan()
    create_grundriss_eg()
    create_grundriss_og()
    create_wohnflaechenberechnung()
    create_energieausweis()
    create_mietvertrag()
    create_baubeschreibung()
    create_objektfotos()
    print("Fertig. Dateien erstellt in:", OUT)
