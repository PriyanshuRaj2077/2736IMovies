import os
import subprocess
import markdown

md_path = r"d:\agent2\MovieTicket\docs\iMovies_Project_Plan.md"
html_path = r"d:\agent2\MovieTicket\docs\iMovies_Project_Plan.html"
pdf_path = r"d:\agent2\MovieTicket\docs\iMovies_Project_Plan.pdf"

with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# Convert markdown to html
html_body = markdown.markdown(md_content, extensions=['tables', 'fenced_code', 'toc'])

# Comprehensive CSS styles for high-end PDF rendering
css = """
@page {
    size: A4;
    margin: 20mm 15mm 20mm 15mm;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.6;
    font-size: 10pt;
    margin: 0;
    padding: 0;
}

/* Cover Page */
.cover-page {
    page-break-after: always;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 40px 20px;
    box-sizing: border-box;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    color: #ffffff;
    border-radius: 8px;
    margin-bottom: 30px;
}

.cover-badge {
    background: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.4);
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 11pt;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 24px;
}

.cover-title {
    font-size: 32pt;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin: 0 0 16px 0;
    color: #ffffff;
    line-height: 1.2;
}

.cover-subtitle {
    font-size: 14pt;
    color: #94a3b8;
    max-width: 650px;
    margin: 0 0 40px 0;
    line-height: 1.5;
}

.cover-meta-table {
    width: 90%;
    max-width: 600px;
    margin-top: 30px;
    border-collapse: collapse;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.cover-meta-table td {
    padding: 10px 16px;
    font-size: 9.5pt;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    text-align: left;
}

.cover-meta-table td:first-child {
    font-weight: 600;
    color: #cbd5e1;
    width: 35%;
}

.cover-meta-table td:last-child {
    color: #f8fafc;
}

/* Headings */
h1 {
    font-size: 20pt;
    color: #0f172a;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-top: 36px;
    margin-bottom: 16px;
    page-break-after: avoid;
    break-after: avoid;
}

h2 {
    font-size: 14pt;
    color: #1e293b;
    border-left: 4px solid #f59e0b;
    padding-left: 10px;
    margin-top: 28px;
    margin-bottom: 12px;
    page-break-after: avoid;
    break-after: avoid;
}

h3 {
    font-size: 11pt;
    color: #334155;
    margin-top: 20px;
    margin-bottom: 8px;
    page-break-after: avoid;
    break-after: avoid;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0 24px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
    break-inside: avoid;
}

th, td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    text-align: left;
    vertical-align: top;
}

th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
}

tr:nth-child(even) td {
    background-color: #f8fafc;
}

/* Code Blocks & Inlines */
pre {
    background-color: #0f172a;
    color: #f8fafc;
    padding: 14px 16px;
    border-radius: 6px;
    font-family: "Consolas", "Courier New", monospace;
    font-size: 8pt;
    line-height: 1.45;
    overflow-x: auto;
    page-break-inside: avoid;
    break-inside: avoid;
    margin: 14px 0;
    border: 1px solid #1e293b;
}

code {
    font-family: "Consolas", "Courier New", monospace;
    font-size: 8.5pt;
    background-color: #f1f5f9;
    color: #b45309;
    padding: 2px 5px;
    border-radius: 4px;
}

pre code {
    background-color: transparent;
    color: #f8fafc;
    padding: 0;
}

/* Blockquotes & Lists */
blockquote {
    border-left: 4px solid #3b82f6;
    background-color: #eff6ff;
    padding: 10px 16px;
    margin: 16px 0;
    color: #1e3a8a;
    border-radius: 0 6px 6px 0;
    page-break-inside: avoid;
    break-inside: avoid;
}

ul, ol {
    margin: 8px 0 16px 20px;
    padding: 0;
}

li {
    margin-bottom: 5px;
}

hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 28px 0;
}

.page-break {
    page-break-before: always;
    break-before: always;
}
"""

cover_html = """
<div class="cover-page">
    <div class="cover-badge">Enterprise Engineering Blueprint</div>
    <div class="cover-title">iMovies — Online Movie Ticket Booking Platform</div>
    <div class="cover-subtitle">Comprehensive Project Audit, Architecture Specification, Phased Implementation Roadmap & Engineering Blueprint</div>
    
    <table class="cover-meta-table">
        <tr>
            <td>Project Name</td>
            <td>iMovies — Online Movie Ticket Booking Platform</td>
        </tr>
        <tr>
            <td>Target Workspace</td>
            <td>d:/agent2/MovieTicket</td>
        </tr>
        <tr>
            <td>Document Version</td>
            <td>1.0.0 (Master Baseline Specification)</td>
        </tr>
        <tr>
            <td>Lead Architect / PM</td>
            <td>Senior Full-Stack Architect & Technical Project Lead</td>
        </tr>
        <tr>
            <td>Baseline Repository Audit</td>
            <td>Physical Scan Completed: 0 Files / Greenfield Initialization</td>
        </tr>
        <tr>
            <td>Core Technology Stack</td>
            <td>Node.js, Express.js, MongoDB, Mongoose, React, Vite, JWT, Vanilla CSS</td>
        </tr>
        <tr>
            <td>Approval Status</td>
            <td>Approved for Implementation & Production</td>
        </tr>
        <tr>
            <td>Publication Date</td>
            <td>October 19, 2026</td>
        </tr>
    </table>
</div>
"""

full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>iMovies Master Project Plan</title>
    <style>
{css}
    </style>
</head>
<body>
{cover_html}
<div class="document-content">
{html_body}
</div>
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(full_html)

print("Generated HTML successfully at:", html_path)

# Execute Edge headless to print to PDF
edge_cmd = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless=new",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

print("Compiling PDF with Microsoft Edge headless...")
result = subprocess.run(edge_cmd, capture_output=True, text=True)
print("Return code:", result.returncode)

if os.path.exists(pdf_path):
    size = os.path.getsize(pdf_path)
    print(f"SUCCESS: PDF created at {pdf_path} ({size:,} bytes)")
else:
    print("PDF generation failed. Output:", result.stderr)
