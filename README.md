# RentZW - Property Rental Platform

A comprehensive property rental web application built for Zimbabwe, connecting tenants and landlords across all major cities and suburbs.

## 🏠 Features

### For Tenants

- Browse and search properties with advanced filters
- Save favorite properties
- Submit rental applications
- View application status
- Contact landlords directly
- Multi-currency support (USD/ZWL)

### For Landlords

- List and manage properties
- Upload property images
- Receive and manage applications
- View property analytics
- Contact tenants

### General Features

- Responsive design for all devices
- User authentication with JWT
- Email notifications
- Real-time currency conversion
- Accessible design (WCAG 2.1 compliant)
- Modern, clean interface

## 🚀 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form management
- **Radix UI** for accessible components
- **Vite** for build tooling

### Backend Ready

- Designed for **Node.js/Express** backend
- **PostgreSQL** database schema ready
- **AWS S3** integration for image storage
- **JWT** authentication system
- **SendGrid** email notifications

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd property-rental-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 Demo Mode

The application runs in demo mode with a mock authentication system. You can:

### Test with Demo Accounts

- **Tenant Account**: `tenant@example.com` / `password123`
- **Landlord Account**: `landlord@example.com` / `password123`

### Create New Accounts

- Sign up as either a tenant or landlord
- All data is stored locally in your browser
- No backend server required for demo

### Features Available in Demo Mode

- ✅ User registration and login
- ✅ Property browsing and search
- ✅ Property listing (landlords)
- ✅ Favorites system (tenants)
- ✅ Application submission
- ✅ Dashboard functionality
- ✅ Currency conversion
- ✅ Responsive design

**Note**: All data is stored in localStorage and will persist until you clear your browser data.

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type checking
npm run typecheck

# Format code
npm run format.fix
```

### Project Structure

```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout components
│   ├── property/       # Property-related components
│   └── ui/             # Base UI components (Radix UI)
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

## 🎨 Design System

The application uses a consistent design system with:

- **Colors**: Blue primary with gray neutrals
- **Typography**: System fonts with clear hierarchy
- **Spacing**: 4px base unit system
- **Components**: Accessible Radix UI primitives
- **Icons**: Lucide React icon set

## 🌍 Localization

Currently supports:

- English (primary language)
- Zimbabwe-specific locations and phone number formats
- USD and ZWL currency support

## 📱 Responsive Design

Fully responsive design with breakpoints:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## ♿ Accessibility

- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators
- Alt text for all images

## 🔐 Security Features

- Input sanitization
- XSS protection
- CSRF protection ready
- Secure authentication
- Rate limiting ready
- HTTPS enforcement

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend Setup Required

This frontend is designed to work with a Node.js/Express backend. Key integrations needed:

1. **Authentication API**

   - `/api/auth/signup`
   - `/api/auth/login`
   - `/api/auth/logout`

2. **Property Management**

   - `/api/properties` (CRUD operations)
   - `/api/properties/search`

3. **User Management**

   - `/api/users/profile`
   - `/api/applications`
   - `/api/favorites`

4. **File Upload**
   - AWS S3 integration
   - Image processing and optimization

## 📧 Email Notifications

Designed to work with SendGrid for:

- Account verification
- Password reset
- Application status updates
- Property inquiries

## 💾 Database Schema

Ready for PostgreSQL with entities:

- Users (tenants/landlords)
- Properties
- Applications
- Favorites
- Images
- Notifications

## 🔧 Configuration

Key configuration options in `.env`:

```env
# API endpoint
VITE_API_URL=your_backend_url

# AWS S3 for image storage
VITE_AWS_S3_BUCKET=your_bucket

# External APIs
VITE_EXCHANGE_RATE_API_KEY=your_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For support, email support@rentzw.com or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Property virtual tours
- [ ] Advanced property analytics
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Integration with payment gateways
- [ ] Property valuation tools
- [ ] Neighborhood insights
- [ ] Advanced search with map integration

---

Built with ❤️ for the Zimbabwe property market.
