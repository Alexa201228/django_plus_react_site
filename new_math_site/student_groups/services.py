import os

os.add_dll_directory(r"C:\Program Files\GTK3-Runtime Win64\bin")

import pandas as pd
import weasyprint as ws_print
import numpy as np
import uuid


def generate_pdf_report(group_name, titles, data):
    """
    Method to generate pdf report on group
    """
    values = np.array(data)
    data_frame = pd.DataFrame(values.reshape(-1, len(titles)), columns=titles)
    html_string = data_frame.to_html(index=False)

    html_doc = ws_print.HTML(string=html_string)
    filename = f'{uuid.uuid4()}-{group_name}'
    html_doc.write_pdf(f'{filename}.pdf', stylesheets=None)
    return filename