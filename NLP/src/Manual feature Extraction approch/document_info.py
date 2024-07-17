import PyPDF2

def get_info(path):
    try:
        with open(path, "rb") as f:
            pdf = PyPDF2.PdfFileReader(f)
            info = pdf.getDocumentInfo()
            print("Document Author: ", info.author)
            print("Document Creator: ", info.creator)
            print("Document Producer: ", info.producer)
            print("Document Title: ", info.title)
            print("Number of pages: ", pdf.getNumPages())
            print("Page Layout: ", pdf.getPageLayout())
            print("Encrypted: ", pdf.isEncrypted)
    except FileNotFoundError:
        print("File not found:", path)
    except Exception as e:
        print("An error occurred:", e)

path = r"D:\folder\nett\Resume-Match-NLP\dataset\trainResumes\candidate_002.pdf"
get_info(path)
