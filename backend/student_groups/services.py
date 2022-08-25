import os
from datetime import datetime
from pathlib import Path

import pandas as pd
from weasyprint import HTML, CSS
import numpy as np
import uuid


def generate_pdf_report(group_name, titles, data):
    """
    Method to generate pdf report on group
    """
    values = np.array(data)
    data_frame = pd.DataFrame(values.reshape(-1, len(titles)), columns=titles)
    html_string = data_frame.to_html(index=False)

    html_doc = HTML(string=html_string)
    css = CSS(string='''
    @page {
        size: A4 landscape;
    }
    table{
        width: 100%;
        display: table;
        border-spacing: 0;
        border-collapse: collapse;
        border: 1px solid grey;
        table-layout: fixed;
        text-align: center;
    }
    thead {
        display: table-header-group;
        table-layout: fixed;
        text-align: center;
    }
    tr {
        display: table-row;
        color: inherit;
        text-align: center;
        table-layout: fixed;
    }
    th {
        display: table-cell;
        border: 1px solid #a2a2a2;
        font-family: Montserrat;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
        table-layout: fixed;
        text-align: center;
    }
    td {
        display: table-cell;
        border: 1px solid #a2a2a2;
        font-family: Montserrat;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
    }
    ''')
    filename = f'{datetime.now().strftime("%d-%m-%Y; %H:%M:%S")}-{group_name}.pdf'
    if not os.path.exists(str(Path().resolve().parent) + '/frontend/public/reports'):
        os.mkdir(str(Path().resolve().parent) + '/frontend/public/reports')
    html_doc.write_pdf(f'{str(Path().resolve().parent)}/frontend/public/reports/{filename}', stylesheets=[css])
    return filename
