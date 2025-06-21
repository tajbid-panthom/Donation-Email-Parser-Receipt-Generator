# Donation Email Parser Receipt Generator

A full-stack web application that parses donation emails and generates professional PDF receipts. Built with React (Frontend) and FastAPI (Backend).

## 🚀 Features

- **Email Parsing**: Automatically extracts donation information from email content
- **PDF Generation**: Creates professional donation receipts in PDF format
- **Real-time Preview**: Preview receipts before downloading
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: Comprehensive loading indicators for better UX
- **Error Handling**: Graceful error handling with user-friendly messages

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/downloads/)
- **Git** - [Download here](https://git-scm.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Donation-Email-Parser-Receipt-Generator.git
cd Donation-Email-Parser-Receipt-Generator
```

### 2. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   If `requirements.txt` doesn't exist, install the required packages manually:
   ```bash
   pip install fastapi uvicorn fpdf python-dateutil pydantic
   ```

4. **Start the backend server:**
   ```bash
   python main.py
   ```

   The backend will run on `http://localhost:8000`

### 3. Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173` to use the application.

## 🔧 Quick Start (Alternative)

If you prefer a faster setup without virtual environments:

```bash
# Clone and setup backend
git clone https://github.com/yourusername/Donation-Email-Parser-Receipt-Generator.git
cd Donation-Email-Parser-Receipt-Generator/backend
pip install fastapi uvicorn fpdf python-dateutil pydantic
python main.py

# In a new terminal, setup frontend
cd ../frontend
npm install
npm run dev
```

## 📁 Project Structure

```
Donation-Email-Parser-Receipt-Generator/
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── logo.png               # Logo for PDF receipts
│   ├── requirements.txt       # Python dependencies
│   └── hope_foundation_emails.txt  # Sample email data
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── LoadingButton.jsx
│   │   │   ├── LoadingOverlay.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── PdfPreview.jsx
│   │   │   ├── ParsedView.jsx
│   │   │   ├── InitilalView.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── ErrorHandle.jsx
│   │   │   ├── Logo.jsx
│   │   │   └── Title.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── README.md
└── DEVELOPMENT_JOURNEY.md
```

## 🎯 How It Works

### Email Parsing Process

The application uses regex patterns to extract the following information from email content:

- **Donor Name**: Extracted from greeting patterns (Hi, Dear, Hello, Hey)
- **Amount**: Extracted from donation amount patterns
- **Date**: Extracted from date patterns
- **Payment Method**: Extracted from payment method patterns
- **Transaction ID**: Extracted from transaction ID patterns
- **Charity Information**: Extracted from charity name and number patterns

### PDF Generation

The backend generates professional PDF receipts using FPDF library with:

- **Header**: Logo, title, receipt number, and date
- **Charity Information**: Name and registration number
- **Donor Information**: Donor name
- **Donation Details**: Transaction details and amount
- **Thank You Message**: Professional acknowledgment

## 📝 Assumptions

### Email Format Assumptions

The parser assumes emails follow these general patterns:

1. **Donor Name**: 
   - Format: `Hi [Name],` or `Dear [Name],` or `Hello [Name],`
   - Assumes single name or full name

2. **Amount**:
   - Format: `Amount: $[amount]` or `donation of $[amount]`
   - Supports comma-separated numbers (e.g., $1,000.00)

3. **Date**:
   - Format: `Date: [Month Day, Year]` or `on [Month Day, Year]`
   - Supports various date formats

4. **Payment Method**:
   - Format: `Payment Method: [method]` or `via [method]`
   - Common methods: Credit Card, PayPal, Bank Transfer, etc.

5. **Transaction ID**:
   - Format: `Transaction ID: [ID]` or `Txn ID: [ID]`
   - Assumes alphanumeric IDs

6. **Charity Information**:
   - Name: `Charity Name: [name]` or `to [name]`
   - Number: `Charity Number: [number]`

### Technical Assumptions

1. **Backend**:
   - FastAPI server running on port 8000
   - CORS enabled for frontend communication
   - FPDF library for PDF generation
   - Python dateutil for date parsing

2. **Frontend**:
   - React with Vite development server
   - Tailwind CSS for styling
   - Fetch API for HTTP requests
   - Modern browser support (ES6+)

3. **Data Validation**:
   - All required fields must be present in email
   - Amount must be a valid number
   - Date must be parseable
   - Email content should be in plain text format

## 🔧 Configuration

### Backend Configuration

The backend can be configured by modifying `main.py`:

- **CORS Origins**: Update allowed origins in the CORS middleware
- **PDF Settings**: Modify PDF generation parameters
- **Regex Patterns**: Update email parsing patterns as needed

### Frontend Configuration

The frontend can be configured by modifying:

- **API URL**: Update `API_URL` in components if backend port changes
- **Styling**: Modify Tailwind classes for custom styling
- **Loading States**: Customize loading indicators and messages

## 🧪 Testing

### Sample Email Format

Use this sample email format for testing:

```
Hi John Doe,

Thank you for your generous donation of $500.00 to Hope Foundation.

Transaction Details:
- Amount: $500.00
- Date: December 15, 2024
- Payment Method: Credit Card
- Transaction ID: TXN-12345-67890
- Charity Name: Hope Foundation
- Charity Number: CH123456

Your donation will make a significant impact on our mission.
```

## 🚨 Error Handling

The application handles various error scenarios:

- **Missing Email Content**: Prompts user to enter email
- **Invalid Email Format**: Shows specific parsing errors
- **Network Issues**: Displays connection error messages
- **PDF Generation Failures**: Provides retry options
- **Invalid Data**: Validates all required fields

## 🔒 Security Considerations

- **Input Validation**: All email content is validated before processing
- **CORS Configuration**: Properly configured for development
- **Error Messages**: Generic error messages to avoid information leakage
- **File Downloads**: Secure PDF generation and download

## 🚀 Deployment

### Backend Deployment

1. **Production Server**: Deploy to a production server (e.g., Render, Railway, Fly.io)
2. **Environment Variables**: Set production environment variables
3. **CORS Configuration**: Update CORS origins for production domain
4. **Static Files**: Ensure logo.png is accessible

### Frontend Deployment

1. **Build**: Run `npm run build` to create production build
2. **Deploy**: Deploy to static hosting (e.g., Vercel, Render)
3. **API URL**: Update API URL to production backend endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:

1. Check the [Issues](https://github.com/yourusername/Donation-Email-Parser-Receipt-Generator/issues) page
2. Review the error handling section above
3. Ensure all dependencies are properly installed
4. Verify backend and frontend are running on correct ports

## 🔄 Changelog

- **v1.0.0**: Initial release with basic email parsing and PDF generation
- **v1.1.0**: Added loading states and improved UX
- **v1.2.0**: Enhanced error handling and PDF preview functionality

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [FPDF Documentation](https://pyfpdf.github.io/fpdf2/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ⭐ Star History

If you find this project helpful, please consider giving it a star on GitHub!