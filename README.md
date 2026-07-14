# Ocean Hazard Monitor

A comprehensive web application for monitoring and reporting ocean hazards, built with Next.js and modern web technologies.

## 🌊 Features

- **Real-time Hazard Monitoring**: Track ocean hazards with interactive maps
- **User Dashboard**: Personalized dashboard for monitoring activities
- **Hazard Reporting**: Report ocean hazards both authenticated and anonymously
- **Analytics**: Comprehensive analytics and data visualization
- **Social Features**: Community engagement and social sharing
- **Admin Panel**: Administrative controls and management
- **Responsive Design**: Mobile-first responsive interface
- **Dark/Light Theme**: Theme switching support

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Maps**: Leaflet for interactive mapping
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks
- **Theme**: next-themes for dark/light mode

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **pnpm** package manager
- **Git** (for version control)

## 🛠️ Installation

1. **Clone the repository** (if from git):
   ```bash
   git clone <repository-url>
   cd VARUNA
   ```

2. **Install dependencies**:
   ```bash
   # Using npm
   npm install

   # Or using pnpm (recommended)
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   # Using npm
   npm run dev

   # Or using pnpm
   pnpm dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
ocean-hazard-monitor/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel
│   ├── analytics/         # Analytics dashboard
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── report/            # Hazard reporting
│   ├── social/            # Social features
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI component library
│   ├── map-component.tsx # Map functionality
│   └── theme-provider.tsx # Theme management
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── styles/               # Additional stylesheets
└── package.json          # Project dependencies
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory for environment-specific variables:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_MAP_API_KEY=your_map_api_key
```

### Tailwind CSS

The project uses Tailwind CSS v4 with custom configuration in `postcss.config.mjs`.

### TypeScript

TypeScript configuration is available in `tsconfig.json` with strict type checking enabled.

## 🗺️ Key Features Breakdown

### Dashboard
- Real-time hazard monitoring
- Personal activity tracking
- Quick access to reporting tools

### Hazard Reporting
- Authenticated user reporting
- Anonymous reporting option
- Form validation with Zod schemas

### Analytics
- Data visualization with Recharts
- Hazard trend analysis
- Geographic distribution maps

### Admin Panel
- User management
- Hazard data administration
- System monitoring

### Social Features
- Community engagement
- Hazard discussion forums
- Social sharing capabilities

## 🎨 UI Components

The project uses a comprehensive UI component library built on Radix UI:

- **Forms**: Input, Select, Checkbox, Radio Group
- **Navigation**: Breadcrumb, Navigation Menu, Tabs
- **Feedback**: Alert, Toast, Progress
- **Overlay**: Dialog, Popover, Tooltip
- **Data Display**: Table, Card, Badge
- **Layout**: Separator, Resizable Panels

## 📱 Responsive Design

The application is built with mobile-first responsive design:

- **Mobile**: Optimized for touch interactions
- **Tablet**: Adaptive layout for medium screens
- **Desktop**: Full-featured interface

## 🔒 Security Features

- Form validation with Zod schemas
- Input sanitization
- Secure authentication flows
- Protected admin routes

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review existing issues for solutions

## 🔄 Version History

- **v0.1.0** - Initial release with core features
  - Dashboard implementation
  - Hazard reporting system
  - Basic analytics
  - Admin panel
  - Responsive UI

---

**Built with ❤️ for ocean safety and environmental monitoring**
