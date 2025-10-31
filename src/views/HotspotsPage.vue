<script setup lang="ts">
import { ref } from 'vue'
import CodeCity from '@/components/common/CodeCity.vue'

// Tymczasowe dane testowe
const cityData = ref({
  name: "root",
  children: [
    {
      name: "internal",
      children: [
        { name: "SessionImpl.java", height: 0.8, width: 0.49 },
        { name: "SessionFactoryImpl.java", height: 0.2, width: 0.43 },
        { name: "Transaction.java", height: 0.4, width: 0.35 },
        { name: "Cache.java", height: 0.55, width: 0.55 }
      ]
    },
    {
      name: "api",
      children: [
        { name: "UserService.java", height: 0.94, width: 0.60 },
        { name: "AuthService.java", height: 0.12, width: 0.70 }
      ]
    },
    { name: "Main.java", height: 0.33, width: 0.85 }
  ]
})

const cityDataBig = ref({
  name: "root",
  children: [
    {
      name: "backend",
      children: [
        {
          name: "auth",
          children: [
            { name: "AuthController.java", height: 0.85, width: 0.92 },
            { name: "AuthService.java", height: 0.67, width: 0.78 },
            { name: "TokenManager.java", height: 0.54, width: 0.65 },
            { name: "PasswordEncoder.java", height: 0.43, width: 0.52 },
            { name: "JwtProvider.java", height: 0.71, width: 0.83 },
            { name: "OAuth2Handler.java", height: 0.58, width: 0.69 },
            { name: "SessionManager.java", height: 0.46, width: 0.57 },
            { name: "RefreshTokenService.java", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "user",
          children: [
            { name: "UserController.java", height: 0.91, width: 0.95 },
            { name: "UserService.java", height: 0.78, width: 0.87 },
            { name: "UserRepository.java", height: 0.52, width: 0.61 },
            { name: "UserMapper.java", height: 0.34, width: 0.43 },
            { name: "UserValidator.java", height: 0.47, width: 0.56 },
            { name: "ProfileService.java", height: 0.63, width: 0.74 },
            { name: "AvatarService.java", height: 0.41, width: 0.50 },
            { name: "UserPreferences.java", height: 0.28, width: 0.37 },
            { name: "NotificationSettings.java", height: 0.35, width: 0.44 }
          ]
        },
        {
          name: "payment",
          children: [
            { name: "PaymentController.java", height: 0.88, width: 0.93 },
            { name: "PaymentService.java", height: 0.76, width: 0.85 },
            { name: "StripeAdapter.java", height: 0.69, width: 0.78 },
            { name: "PayPalAdapter.java", height: 0.64, width: 0.73 },
            { name: "TransactionLogger.java", height: 0.51, width: 0.60 },
            { name: "RefundService.java", height: 0.57, width: 0.66 },
            { name: "InvoiceGenerator.java", height: 0.72, width: 0.81 },
            { name: "PaymentValidator.java", height: 0.44, width: 0.53 },
            { name: "CurrencyConverter.java", height: 0.38, width: 0.47 },
            { name: "SubscriptionManager.java", height: 0.82, width: 0.91 }
          ]
        },
        {
          name: "order",
          children: [
            { name: "OrderController.java", height: 0.93, width: 0.98 },
            { name: "OrderService.java", height: 0.81, width: 0.90 },
            { name: "OrderRepository.java", height: 0.55, width: 0.64 },
            { name: "CartService.java", height: 0.68, width: 0.77 },
            { name: "CheckoutService.java", height: 0.74, width: 0.83 },
            { name: "ShippingCalculator.java", height: 0.49, width: 0.58 },
            { name: "OrderValidator.java", height: 0.42, width: 0.51 },
            { name: "OrderStatusTracker.java", height: 0.61, width: 0.70 },
            { name: "DeliveryService.java", height: 0.66, width: 0.75 },
            { name: "ReturnHandler.java", height: 0.53, width: 0.62 }
          ]
        },
        {
          name: "product",
          children: [
            { name: "ProductController.java", height: 0.87, width: 0.94 },
            { name: "ProductService.java", height: 0.79, width: 0.88 },
            { name: "ProductRepository.java", height: 0.56, width: 0.65 },
            { name: "CategoryService.java", height: 0.64, width: 0.73 },
            { name: "InventoryManager.java", height: 0.71, width: 0.80 },
            { name: "PriceCalculator.java", height: 0.48, width: 0.57 },
            { name: "DiscountService.java", height: 0.59, width: 0.68 },
            { name: "ImageService.java", height: 0.52, width: 0.61 },
            { name: "SearchService.java", height: 0.77, width: 0.86 },
            { name: "RecommendationEngine.java", height: 0.83, width: 0.92 },
            { name: "ReviewService.java", height: 0.45, width: 0.54 },
            { name: "RatingCalculator.java", height: 0.37, width: 0.46 }
          ]
        },
        {
          name: "notification",
          children: [
            { name: "NotificationController.java", height: 0.73, width: 0.82 },
            { name: "NotificationService.java", height: 0.65, width: 0.74 },
            { name: "EmailService.java", height: 0.69, width: 0.78 },
            { name: "SmsService.java", height: 0.54, width: 0.63 },
            { name: "PushNotificationService.java", height: 0.61, width: 0.70 },
            { name: "TemplateEngine.java", height: 0.48, width: 0.57 },
            { name: "NotificationQueue.java", height: 0.56, width: 0.65 }
          ]
        },
        {
          name: "analytics",
          children: [
            { name: "AnalyticsController.java", height: 0.76, width: 0.85 },
            { name: "AnalyticsService.java", height: 0.82, width: 0.91 },
            { name: "EventTracker.java", height: 0.67, width: 0.76 },
            { name: "MetricsCollector.java", height: 0.59, width: 0.68 },
            { name: "ReportGenerator.java", height: 0.74, width: 0.83 },
            { name: "DashboardService.java", height: 0.71, width: 0.80 },
            { name: "DataAggregator.java", height: 0.63, width: 0.72 },
            { name: "ChartBuilder.java", height: 0.51, width: 0.60 }
          ]
        }
      ]
    },
    {
      name: "frontend",
      children: [
        {
          name: "components",
          children: [
            {
              name: "common",
              children: [
                { name: "Button.tsx", height: 0.32, width: 0.41 },
                { name: "Input.tsx", height: 0.38, width: 0.47 },
                { name: "Modal.tsx", height: 0.55, width: 0.64 },
                { name: "Dropdown.tsx", height: 0.47, width: 0.56 },
                { name: "Card.tsx", height: 0.42, width: 0.51 },
                { name: "Badge.tsx", height: 0.24, width: 0.33 },
                { name: "Avatar.tsx", height: 0.29, width: 0.38 },
                { name: "Tooltip.tsx", height: 0.36, width: 0.45 },
                { name: "Spinner.tsx", height: 0.21, width: 0.30 },
                { name: "Alert.tsx", height: 0.43, width: 0.52 }
              ]
            },
            {
              name: "layout",
              children: [
                { name: "Header.tsx", height: 0.68, width: 0.77 },
                { name: "Footer.tsx", height: 0.51, width: 0.60 },
                { name: "Sidebar.tsx", height: 0.73, width: 0.82 },
                { name: "Navigation.tsx", height: 0.64, width: 0.73 },
                { name: "Container.tsx", height: 0.39, width: 0.48 },
                { name: "Grid.tsx", height: 0.46, width: 0.55 },
                { name: "Breadcrumb.tsx", height: 0.41, width: 0.50 }
              ]
            },
            {
              name: "forms",
              children: [
                { name: "LoginForm.tsx", height: 0.61, width: 0.70 },
                { name: "RegisterForm.tsx", height: 0.69, width: 0.78 },
                { name: "ProfileForm.tsx", height: 0.74, width: 0.83 },
                { name: "CheckoutForm.tsx", height: 0.82, width: 0.91 },
                { name: "SearchForm.tsx", height: 0.48, width: 0.57 },
                { name: "FilterForm.tsx", height: 0.56, width: 0.65 },
                { name: "ContactForm.tsx", height: 0.53, width: 0.62 },
                { name: "FormValidator.tsx", height: 0.44, width: 0.53 }
              ]
            },
            {
              name: "product",
              children: [
                { name: "ProductCard.tsx", height: 0.58, width: 0.67 },
                { name: "ProductList.tsx", height: 0.71, width: 0.80 },
                { name: "ProductDetail.tsx", height: 0.85, width: 0.94 },
                { name: "ProductGallery.tsx", height: 0.63, width: 0.72 },
                { name: "ProductReviews.tsx", height: 0.69, width: 0.78 },
                { name: "ProductFilter.tsx", height: 0.54, width: 0.63 },
                { name: "ProductComparison.tsx", height: 0.76, width: 0.85 }
              ]
            },
            {
              name: "cart",
              children: [
                { name: "CartItem.tsx", height: 0.49, width: 0.58 },
                { name: "CartSummary.tsx", height: 0.61, width: 0.70 },
                { name: "CartDrawer.tsx", height: 0.67, width: 0.76 },
                { name: "CartButton.tsx", height: 0.38, width: 0.47 },
                { name: "EmptyCart.tsx", height: 0.42, width: 0.51 }
              ]
            }
          ]
        },
        {
          name: "pages",
          children: [
            { name: "HomePage.tsx", height: 0.78, width: 0.87 },
            { name: "ProductPage.tsx", height: 0.91, width: 0.97 },
            { name: "CartPage.tsx", height: 0.73, width: 0.82 },
            { name: "CheckoutPage.tsx", height: 0.88, width: 0.95 },
            { name: "ProfilePage.tsx", height: 0.69, width: 0.78 },
            { name: "OrderHistoryPage.tsx", height: 0.76, width: 0.85 },
            { name: "AboutPage.tsx", height: 0.54, width: 0.63 },
            { name: "ContactPage.tsx", height: 0.58, width: 0.67 },
            { name: "NotFoundPage.tsx", height: 0.41, width: 0.50 }
          ]
        },
        {
          name: "store",
          children: [
            { name: "authStore.ts", height: 0.62, width: 0.71 },
            { name: "cartStore.ts", height: 0.71, width: 0.80 },
            { name: "productStore.ts", height: 0.68, width: 0.77 },
            { name: "userStore.ts", height: 0.56, width: 0.65 },
            { name: "notificationStore.ts", height: 0.49, width: 0.58 },
            { name: "uiStore.ts", height: 0.44, width: 0.53 }
          ]
        },
        {
          name: "services",
          children: [
            { name: "api.ts", height: 0.74, width: 0.83 },
            { name: "authService.ts", height: 0.66, width: 0.75 },
            { name: "productService.ts", height: 0.69, width: 0.78 },
            { name: "orderService.ts", height: 0.72, width: 0.81 },
            { name: "userService.ts", height: 0.58, width: 0.67 },
            { name: "storageService.ts", height: 0.47, width: 0.56 },
            { name: "analyticsService.ts", height: 0.53, width: 0.62 }
          ]
        },
        {
          name: "utils",
          children: [
            { name: "formatters.ts", height: 0.51, width: 0.60 },
            { name: "validators.ts", height: 0.58, width: 0.67 },
            { name: "constants.ts", height: 0.36, width: 0.45 },
            { name: "helpers.ts", height: 0.63, width: 0.72 },
            { name: "dateUtils.ts", height: 0.44, width: 0.53 },
            { name: "stringUtils.ts", height: 0.39, width: 0.48 },
            { name: "arrayUtils.ts", height: 0.42, width: 0.51 }
          ]
        },
        {
          name: "hooks",
          children: [
            { name: "useAuth.ts", height: 0.48, width: 0.57 },
            { name: "useCart.ts", height: 0.52, width: 0.61 },
            { name: "useProduct.ts", height: 0.49, width: 0.58 },
            { name: "useDebounce.ts", height: 0.33, width: 0.42 },
            { name: "useLocalStorage.ts", height: 0.41, width: 0.50 },
            { name: "useMediaQuery.ts", height: 0.37, width: 0.46 },
            { name: "useIntersection.ts", height: 0.44, width: 0.53 }
          ]
        }
      ]
    },
    {
      name: "shared",
      children: [
        {
          name: "models",
          children: [
            { name: "User.java", height: 0.56, width: 0.65 },
            { name: "Product.java", height: 0.61, width: 0.70 },
            { name: "Order.java", height: 0.68, width: 0.77 },
            { name: "Payment.java", height: 0.52, width: 0.61 },
            { name: "Address.java", height: 0.44, width: 0.53 },
            { name: "Category.java", height: 0.38, width: 0.47 },
            { name: "Review.java", height: 0.47, width: 0.56 },
            { name: "Notification.java", height: 0.41, width: 0.50 }
          ]
        },
        {
          name: "dto",
          children: [
            { name: "UserDTO.java", height: 0.43, width: 0.52 },
            { name: "ProductDTO.java", height: 0.48, width: 0.57 },
            { name: "OrderDTO.java", height: 0.54, width: 0.63 },
            { name: "PaymentDTO.java", height: 0.41, width: 0.50 },
            { name: "AddressDTO.java", height: 0.36, width: 0.45 },
            { name: "CartItemDTO.java", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "exceptions",
          children: [
            { name: "UserNotFoundException.java", height: 0.28, width: 0.37 },
            { name: "ProductNotFoundException.java", height: 0.31, width: 0.40 },
            { name: "PaymentException.java", height: 0.34, width: 0.43 },
            { name: "ValidationException.java", height: 0.37, width: 0.46 },
            { name: "AuthenticationException.java", height: 0.39, width: 0.48 },
            { name: "OrderException.java", height: 0.33, width: 0.42 }
          ]
        },
        {
          name: "config",
          children: [
            { name: "DatabaseConfig.java", height: 0.58, width: 0.67 },
            { name: "SecurityConfig.java", height: 0.72, width: 0.81 },
            { name: "CacheConfig.java", height: 0.49, width: 0.58 },
            { name: "SwaggerConfig.java", height: 0.54, width: 0.63 },
            { name: "MailConfig.java", height: 0.46, width: 0.55 },
            { name: "SchedulerConfig.java", height: 0.51, width: 0.60 }
          ]
        },
        {
          name: "constants",
          children: [
            { name: "ApiConstants.java", height: 0.32, width: 0.41 },
            { name: "ErrorMessages.java", height: 0.38, width: 0.47 },
            { name: "RoleConstants.java", height: 0.26, width: 0.35 },
            { name: "StatusConstants.java", height: 0.29, width: 0.38 }
          ]
        },
        {
          name: "utils",
          children: [
            { name: "DateUtils.java", height: 0.44, width: 0.53 },
            { name: "StringUtils.java", height: 0.39, width: 0.48 },
            { name: "ValidationUtils.java", height: 0.51, width: 0.60 },
            { name: "EncryptionUtils.java", height: 0.56, width: 0.65 },
            { name: "FileUtils.java", height: 0.48, width: 0.57 },
            { name: "JsonUtils.java", height: 0.42, width: 0.51 }
          ]
        }
      ]
    },
    {
      name: "database",
      children: [
        {
          name: "migrations",
          children: [
            { name: "V1_create_users.sql", height: 0.41, width: 0.50 },
            { name: "V2_create_products.sql", height: 0.46, width: 0.55 },
            { name: "V3_create_orders.sql", height: 0.52, width: 0.61 },
            { name: "V4_create_payments.sql", height: 0.44, width: 0.53 },
            { name: "V5_add_indexes.sql", height: 0.37, width: 0.46 },
            { name: "V6_create_reviews.sql", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "seeds",
          children: [
            { name: "UserSeeder.java", height: 0.48, width: 0.57 },
            { name: "ProductSeeder.java", height: 0.63, width: 0.72 },
            { name: "CategorySeeder.java", height: 0.51, width: 0.60 }
          ]
        }
      ]
    },
    {
      name: "tests",
      children: [
        {
          name: "backend",
          children: [
            {
              name: "unit",
              children: [
                { name: "UserServiceTest.java", height: 0.71, width: 0.80 },
                { name: "ProductServiceTest.java", height: 0.76, width: 0.85 },
                { name: "OrderServiceTest.java", height: 0.79, width: 0.88 },
                { name: "PaymentServiceTest.java", height: 0.73, width: 0.82 },
                { name: "AuthServiceTest.java", height: 0.68, width: 0.77 }
              ]
            },
            {
              name: "integration",
              children: [
                { name: "UserControllerTest.java", height: 0.84, width: 0.93 },
                { name: "ProductControllerTest.java", height: 0.88, width: 0.95 },
                { name: "OrderControllerTest.java", height: 0.91, width: 0.98 },
                { name: "PaymentIntegrationTest.java", height: 0.86, width: 0.94 }
              ]
            }
          ]
        },
        {
          name: "frontend",
          children: [
            {
              name: "unit",
              children: [
                { name: "Button.test.tsx", height: 0.38, width: 0.47 },
                { name: "ProductCard.test.tsx", height: 0.46, width: 0.55 },
                { name: "CartStore.test.ts", height: 0.54, width: 0.63 },
                { name: "formatters.test.ts", height: 0.42, width: 0.51 }
              ]
            },
            {
              name: "e2e",
              children: [
                { name: "login.spec.ts", height: 0.59, width: 0.68 },
                { name: "checkout.spec.ts", height: 0.73, width: 0.82 },
                { name: "product-search.spec.ts", height: 0.64, width: 0.73 }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "docs",
      children: [
        { name: "API.md", height: 0.68, width: 0.77 },
        { name: "ARCHITECTURE.md", height: 0.81, width: 0.90 },
        { name: "SETUP.md", height: 0.54, width: 0.63 },
        { name: "CONTRIBUTING.md", height: 0.61, width: 0.70 },
        { name: "CHANGELOG.md", height: 0.47, width: 0.56 }
      ]
    },
    { name: "README.md", height: 0.58, width: 0.67 },
    { name: "package.json", height: 0.39, width: 0.48 },
    { name: "pom.xml", height: 0.52, width: 0.61 },
    { name: "docker-compose.yml", height: 0.46, width: 0.55 },
    { name: ".gitignore", height: 0.24, width: 0.33 },
    {
  name: "root",
  children: [
    {
      name: "backend",
      children: [
        {
          name: "auth",
          children: [
            { name: "AuthController.java", height: 0.85, width: 0.92 },
            { name: "AuthService.java", height: 0.67, width: 0.78 },
            { name: "TokenManager.java", height: 0.54, width: 0.65 },
            { name: "PasswordEncoder.java", height: 0.43, width: 0.52 },
            { name: "JwtProvider.java", height: 0.71, width: 0.83 },
            { name: "OAuth2Handler.java", height: 0.58, width: 0.69 },
            { name: "SessionManager.java", height: 0.46, width: 0.57 },
            { name: "RefreshTokenService.java", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "user",
          children: [
            { name: "UserController.java", height: 0.91, width: 0.95 },
            { name: "UserService.java", height: 0.78, width: 0.87 },
            { name: "UserRepository.java", height: 0.52, width: 0.61 },
            { name: "UserMapper.java", height: 0.34, width: 0.43 },
            { name: "UserValidator.java", height: 0.47, width: 0.56 },
            { name: "ProfileService.java", height: 0.63, width: 0.74 },
            { name: "AvatarService.java", height: 0.41, width: 0.50 },
            { name: "UserPreferences.java", height: 0.28, width: 0.37 },
            { name: "NotificationSettings.java", height: 0.35, width: 0.44 }
          ]
        },
        {
          name: "payment",
          children: [
            { name: "PaymentController.java", height: 0.88, width: 0.93 },
            { name: "PaymentService.java", height: 0.76, width: 0.85 },
            { name: "StripeAdapter.java", height: 0.69, width: 0.78 },
            { name: "PayPalAdapter.java", height: 0.64, width: 0.73 },
            { name: "TransactionLogger.java", height: 0.51, width: 0.60 },
            { name: "RefundService.java", height: 0.57, width: 0.66 },
            { name: "InvoiceGenerator.java", height: 0.72, width: 0.81 },
            { name: "PaymentValidator.java", height: 0.44, width: 0.53 },
            { name: "CurrencyConverter.java", height: 0.38, width: 0.47 },
            { name: "SubscriptionManager.java", height: 0.82, width: 0.91 }
          ]
        },
        {
          name: "order",
          children: [
            { name: "OrderController.java", height: 0.93, width: 0.98 },
            { name: "OrderService.java", height: 0.81, width: 0.90 },
            { name: "OrderRepository.java", height: 0.55, width: 0.64 },
            { name: "CartService.java", height: 0.68, width: 0.77 },
            { name: "CheckoutService.java", height: 0.74, width: 0.83 },
            { name: "ShippingCalculator.java", height: 0.49, width: 0.58 },
            { name: "OrderValidator.java", height: 0.42, width: 0.51 },
            { name: "OrderStatusTracker.java", height: 0.61, width: 0.70 },
            { name: "DeliveryService.java", height: 0.66, width: 0.75 },
            { name: "ReturnHandler.java", height: 0.53, width: 0.62 }
          ]
        },
        {
          name: "product",
          children: [
            { name: "ProductController.java", height: 0.87, width: 0.94 },
            { name: "ProductService.java", height: 0.79, width: 0.88 },
            { name: "ProductRepository.java", height: 0.56, width: 0.65 },
            { name: "CategoryService.java", height: 0.64, width: 0.73 },
            { name: "InventoryManager.java", height: 0.71, width: 0.80 },
            { name: "PriceCalculator.java", height: 0.48, width: 0.57 },
            { name: "DiscountService.java", height: 0.59, width: 0.68 },
            { name: "ImageService.java", height: 0.52, width: 0.61 },
            { name: "SearchService.java", height: 0.77, width: 0.86 },
            { name: "RecommendationEngine.java", height: 0.83, width: 0.92 },
            { name: "ReviewService.java", height: 0.45, width: 0.54 },
            { name: "RatingCalculator.java", height: 0.37, width: 0.46 }
          ]
        },
        {
          name: "notification",
          children: [
            { name: "NotificationController.java", height: 0.73, width: 0.82 },
            { name: "NotificationService.java", height: 0.65, width: 0.74 },
            { name: "EmailService.java", height: 0.69, width: 0.78 },
            { name: "SmsService.java", height: 0.54, width: 0.63 },
            { name: "PushNotificationService.java", height: 0.61, width: 0.70 },
            { name: "TemplateEngine.java", height: 0.48, width: 0.57 },
            { name: "NotificationQueue.java", height: 0.56, width: 0.65 }
          ]
        },
        {
          name: "analytics",
          children: [
            { name: "AnalyticsController.java", height: 0.76, width: 0.85 },
            { name: "AnalyticsService.java", height: 0.82, width: 0.91 },
            { name: "EventTracker.java", height: 0.67, width: 0.76 },
            { name: "MetricsCollector.java", height: 0.59, width: 0.68 },
            { name: "ReportGenerator.java", height: 0.74, width: 0.83 },
            { name: "DashboardService.java", height: 0.71, width: 0.80 },
            { name: "DataAggregator.java", height: 0.63, width: 0.72 },
            { name: "ChartBuilder.java", height: 0.51, width: 0.60 }
          ]
        }
      ]
    },
    {
      name: "frontend",
      children: [
        {
          name: "components",
          children: [
            {
              name: "common",
              children: [
                { name: "Button.tsx", height: 0.32, width: 0.41 },
                { name: "Input.tsx", height: 0.38, width: 0.47 },
                { name: "Modal.tsx", height: 0.55, width: 0.64 },
                { name: "Dropdown.tsx", height: 0.47, width: 0.56 },
                { name: "Card.tsx", height: 0.42, width: 0.51 },
                { name: "Badge.tsx", height: 0.24, width: 0.33 },
                { name: "Avatar.tsx", height: 0.29, width: 0.38 },
                { name: "Tooltip.tsx", height: 0.36, width: 0.45 },
                { name: "Spinner.tsx", height: 0.21, width: 0.30 },
                { name: "Alert.tsx", height: 0.43, width: 0.52 }
              ]
            },
            {
              name: "layout",
              children: [
                { name: "Header.tsx", height: 0.68, width: 0.77 },
                { name: "Footer.tsx", height: 0.51, width: 0.60 },
                { name: "Sidebar.tsx", height: 0.73, width: 0.82 },
                { name: "Navigation.tsx", height: 0.64, width: 0.73 },
                { name: "Container.tsx", height: 0.39, width: 0.48 },
                { name: "Grid.tsx", height: 0.46, width: 0.55 },
                { name: "Breadcrumb.tsx", height: 0.41, width: 0.50 }
              ]
            },
            {
              name: "forms",
              children: [
                { name: "LoginForm.tsx", height: 0.61, width: 0.70 },
                { name: "RegisterForm.tsx", height: 0.69, width: 0.78 },
                { name: "ProfileForm.tsx", height: 0.74, width: 0.83 },
                { name: "CheckoutForm.tsx", height: 0.82, width: 0.91 },
                { name: "SearchForm.tsx", height: 0.48, width: 0.57 },
                { name: "FilterForm.tsx", height: 0.56, width: 0.65 },
                { name: "ContactForm.tsx", height: 0.53, width: 0.62 },
                { name: "FormValidator.tsx", height: 0.44, width: 0.53 }
              ]
            },
            {
              name: "product",
              children: [
                { name: "ProductCard.tsx", height: 0.58, width: 0.67 },
                { name: "ProductList.tsx", height: 0.71, width: 0.80 },
                { name: "ProductDetail.tsx", height: 0.85, width: 0.94 },
                { name: "ProductGallery.tsx", height: 0.63, width: 0.72 },
                { name: "ProductReviews.tsx", height: 0.69, width: 0.78 },
                { name: "ProductFilter.tsx", height: 0.54, width: 0.63 },
                { name: "ProductComparison.tsx", height: 0.76, width: 0.85 }
              ]
            },
            {
              name: "cart",
              children: [
                { name: "CartItem.tsx", height: 0.49, width: 0.58 },
                { name: "CartSummary.tsx", height: 0.61, width: 0.70 },
                { name: "CartDrawer.tsx", height: 0.67, width: 0.76 },
                { name: "CartButton.tsx", height: 0.38, width: 0.47 },
                { name: "EmptyCart.tsx", height: 0.42, width: 0.51 }
              ]
            }
          ]
        },
        {
          name: "pages",
          children: [
            { name: "HomePage.tsx", height: 0.78, width: 0.87 },
            { name: "ProductPage.tsx", height: 0.91, width: 0.97 },
            { name: "CartPage.tsx", height: 0.73, width: 0.82 },
            { name: "CheckoutPage.tsx", height: 0.88, width: 0.95 },
            { name: "ProfilePage.tsx", height: 0.69, width: 0.78 },
            { name: "OrderHistoryPage.tsx", height: 0.76, width: 0.85 },
            { name: "AboutPage.tsx", height: 0.54, width: 0.63 },
            { name: "ContactPage.tsx", height: 0.58, width: 0.67 },
            { name: "NotFoundPage.tsx", height: 0.41, width: 0.50 }
          ]
        },
        {
          name: "store",
          children: [
            { name: "authStore.ts", height: 0.62, width: 0.71 },
            { name: "cartStore.ts", height: 0.71, width: 0.80 },
            { name: "productStore.ts", height: 0.68, width: 0.77 },
            { name: "userStore.ts", height: 0.56, width: 0.65 },
            { name: "notificationStore.ts", height: 0.49, width: 0.58 },
            { name: "uiStore.ts", height: 0.44, width: 0.53 }
          ]
        },
        {
          name: "services",
          children: [
            { name: "api.ts", height: 0.74, width: 0.83 },
            { name: "authService.ts", height: 0.66, width: 0.75 },
            { name: "productService.ts", height: 0.69, width: 0.78 },
            { name: "orderService.ts", height: 0.72, width: 0.81 },
            { name: "userService.ts", height: 0.58, width: 0.67 },
            { name: "storageService.ts", height: 0.47, width: 0.56 },
            { name: "analyticsService.ts", height: 0.53, width: 0.62 }
          ]
        },
        {
          name: "utils",
          children: [
            { name: "formatters.ts", height: 0.51, width: 0.60 },
            { name: "validators.ts", height: 0.58, width: 0.67 },
            { name: "constants.ts", height: 0.36, width: 0.45 },
            { name: "helpers.ts", height: 0.63, width: 0.72 },
            { name: "dateUtils.ts", height: 0.44, width: 0.53 },
            { name: "stringUtils.ts", height: 0.39, width: 0.48 },
            { name: "arrayUtils.ts", height: 0.42, width: 0.51 }
          ]
        },
        {
          name: "hooks",
          children: [
            { name: "useAuth.ts", height: 0.48, width: 0.57 },
            { name: "useCart.ts", height: 0.52, width: 0.61 },
            { name: "useProduct.ts", height: 0.49, width: 0.58 },
            { name: "useDebounce.ts", height: 0.33, width: 0.42 },
            { name: "useLocalStorage.ts", height: 0.41, width: 0.50 },
            { name: "useMediaQuery.ts", height: 0.37, width: 0.46 },
            { name: "useIntersection.ts", height: 0.44, width: 0.53 }
          ]
        }
      ]
    },
    {
      name: "shared",
      children: [
        {
          name: "models",
          children: [
            { name: "User.java", height: 0.56, width: 0.65 },
            { name: "Product.java", height: 0.61, width: 0.70 },
            { name: "Order.java", height: 0.68, width: 0.77 },
            { name: "Payment.java", height: 0.52, width: 0.61 },
            { name: "Address.java", height: 0.44, width: 0.53 },
            { name: "Category.java", height: 0.38, width: 0.47 },
            { name: "Review.java", height: 0.47, width: 0.56 },
            { name: "Notification.java", height: 0.41, width: 0.50 }
          ]
        },
        {
          name: "dto",
          children: [
            { name: "UserDTO.java", height: 0.43, width: 0.52 },
            { name: "ProductDTO.java", height: 0.48, width: 0.57 },
            { name: "OrderDTO.java", height: 0.54, width: 0.63 },
            { name: "PaymentDTO.java", height: 0.41, width: 0.50 },
            { name: "AddressDTO.java", height: 0.36, width: 0.45 },
            { name: "CartItemDTO.java", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "exceptions",
          children: [
            { name: "UserNotFoundException.java", height: 0.28, width: 0.37 },
            { name: "ProductNotFoundException.java", height: 0.31, width: 0.40 },
            { name: "PaymentException.java", height: 0.34, width: 0.43 },
            { name: "ValidationException.java", height: 0.37, width: 0.46 },
            { name: "AuthenticationException.java", height: 0.39, width: 0.48 },
            { name: "OrderException.java", height: 0.33, width: 0.42 }
          ]
        },
        {
          name: "config",
          children: [
            { name: "DatabaseConfig.java", height: 0.58, width: 0.67 },
            { name: "SecurityConfig.java", height: 0.72, width: 0.81 },
            { name: "CacheConfig.java", height: 0.49, width: 0.58 },
            { name: "SwaggerConfig.java", height: 0.54, width: 0.63 },
            { name: "MailConfig.java", height: 0.46, width: 0.55 },
            { name: "SchedulerConfig.java", height: 0.51, width: 0.60 }
          ]
        },
        {
          name: "constants",
          children: [
            { name: "ApiConstants.java", height: 0.32, width: 0.41 },
            { name: "ErrorMessages.java", height: 0.38, width: 0.47 },
            { name: "RoleConstants.java", height: 0.26, width: 0.35 },
            { name: "StatusConstants.java", height: 0.29, width: 0.38 }
          ]
        },
        {
          name: "utils",
          children: [
            { name: "DateUtils.java", height: 0.44, width: 0.53 },
            { name: "StringUtils.java", height: 0.39, width: 0.48 },
            { name: "ValidationUtils.java", height: 0.51, width: 0.60 },
            { name: "EncryptionUtils.java", height: 0.56, width: 0.65 },
            { name: "FileUtils.java", height: 0.48, width: 0.57 },
            { name: "JsonUtils.java", height: 0.42, width: 0.51 }
          ]
        }
      ]
    },
    {
      name: "database",
      children: [
        {
          name: "migrations",
          children: [
            { name: "V1_create_users.sql", height: 0.41, width: 0.50 },
            { name: "V2_create_products.sql", height: 0.46, width: 0.55 },
            { name: "V3_create_orders.sql", height: 0.52, width: 0.61 },
            { name: "V4_create_payments.sql", height: 0.44, width: 0.53 },
            { name: "V5_add_indexes.sql", height: 0.37, width: 0.46 },
            { name: "V6_create_reviews.sql", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "seeds",
          children: [
            { name: "UserSeeder.java", height: 0.48, width: 0.57 },
            { name: "ProductSeeder.java", height: 0.63, width: 0.72 },
            { name: "CategorySeeder.java", height: 0.51, width: 0.60 }
          ]
        }
      ]
    },
    {
      name: "tests",
      children: [
        {
          name: "backend",
          children: [
            {
              name: "unit",
              children: [
                { name: "UserServiceTest.java", height: 0.71, width: 0.80 },
                { name: "ProductServiceTest.java", height: 0.76, width: 0.85 },
                { name: "OrderServiceTest.java", height: 0.79, width: 0.88 },
                { name: "PaymentServiceTest.java", height: 0.73, width: 0.82 },
                { name: "AuthServiceTest.java", height: 0.68, width: 0.77 }
              ]
            },
            {
              name: "integration",
              children: [
                { name: "UserControllerTest.java", height: 0.84, width: 0.93 },
                { name: "ProductControllerTest.java", height: 0.88, width: 0.95 },
                { name: "OrderControllerTest.java", height: 0.91, width: 0.98 },
                { name: "PaymentIntegrationTest.java", height: 0.86, width: 0.94 }
              ]
            }
          ]
        },
        {
          name: "frontend",
          children: [
            {
              name: "unit",
              children: [
                { name: "Button.test.tsx", height: 0.38, width: 0.47 },
                { name: "ProductCard.test.tsx", height: 0.46, width: 0.55 },
                { name: "CartStore.test.ts", height: 0.54, width: 0.63 },
                { name: "formatters.test.ts", height: 0.42, width: 0.51 }
              ]
            },
            {
              name: "e2e",
              children: [
                { name: "login.spec.ts", height: 0.59, width: 0.68 },
                { name: "checkout.spec.ts", height: 0.73, width: 0.82 },
                { name: "product-search.spec.ts", height: 0.64, width: 0.73 }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "docs",
      children: [
        { name: "API.md", height: 0.68, width: 0.77 },
        { name: "ARCHITECTURE.md", height: 0.81, width: 0.90 },
        { name: "SETUP.md", height: 0.54, width: 0.63 },
        { name: "CONTRIBUTING.md", height: 0.61, width: 0.70 },
        { name: "CHANGELOG.md", height: 0.47, width: 0.56 }
      ]
    },
    { name: "README.md", height: 0.58, width: 0.67 },
    { name: "package.json", height: 0.39, width: 0.48 },
    { name: "pom.xml", height: 0.52, width: 0.61 },
    { name: "docker-compose.yml", height: 0.46, width: 0.55 },
    { name: ".gitignore", height: 0.24, width: 0.33 },
    {
  name: "root",
  children: [
    {
      name: "backend",
      children: [
        {
          name: "auth",
          children: [
            { name: "AuthController.java", height: 0.85, width: 0.92 },
            { name: "AuthService.java", height: 0.67, width: 0.78 },
            { name: "TokenManager.java", height: 0.54, width: 0.65 },
            { name: "PasswordEncoder.java", height: 0.43, width: 0.52 },
            { name: "JwtProvider.java", height: 0.71, width: 0.83 },
            { name: "OAuth2Handler.java", height: 0.58, width: 0.69 },
            { name: "SessionManager.java", height: 0.46, width: 0.57 },
            { name: "RefreshTokenService.java", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "user",
          children: [
            { name: "UserController.java", height: 0.91, width: 0.95 },
            { name: "UserService.java", height: 0.78, width: 0.87 },
            { name: "UserRepository.java", height: 0.52, width: 0.61 },
            { name: "UserMapper.java", height: 0.34, width: 0.43 },
            { name: "UserValidator.java", height: 0.47, width: 0.56 },
            { name: "ProfileService.java", height: 0.63, width: 0.74 },
            { name: "AvatarService.java", height: 0.41, width: 0.50 },
            { name: "UserPreferences.java", height: 0.28, width: 0.37 },
            { name: "NotificationSettings.java", height: 0.35, width: 0.44 }
          ]
        },
        {
          name: "payment",
          children: [
            { name: "PaymentController.java", height: 0.88, width: 0.93 },
            { name: "PaymentService.java", height: 0.76, width: 0.85 },
            { name: "StripeAdapter.java", height: 0.69, width: 0.78 },
            { name: "PayPalAdapter.java", height: 0.64, width: 0.73 },
            { name: "TransactionLogger.java", height: 0.51, width: 0.60 },
            { name: "RefundService.java", height: 0.57, width: 0.66 },
            { name: "InvoiceGenerator.java", height: 0.72, width: 0.81 },
            { name: "PaymentValidator.java", height: 0.44, width: 0.53 },
            { name: "CurrencyConverter.java", height: 0.38, width: 0.47 },
            { name: "SubscriptionManager.java", height: 0.82, width: 0.91 }
          ]
        },
        {
          name: "order",
          children: [
            { name: "OrderController.java", height: 0.93, width: 0.98 },
            { name: "OrderService.java", height: 0.81, width: 0.90 },
            { name: "OrderRepository.java", height: 0.55, width: 0.64 },
            { name: "CartService.java", height: 0.68, width: 0.77 },
            { name: "CheckoutService.java", height: 0.74, width: 0.83 },
            { name: "ShippingCalculator.java", height: 0.49, width: 0.58 },
            { name: "OrderValidator.java", height: 0.42, width: 0.51 },
            { name: "OrderStatusTracker.java", height: 0.61, width: 0.70 },
            { name: "DeliveryService.java", height: 0.66, width: 0.75 },
            { name: "ReturnHandler.java", height: 0.53, width: 0.62 }
          ]
        },
        {
          name: "product",
          children: [
            { name: "ProductController.java", height: 0.87, width: 0.94 },
            { name: "ProductService.java", height: 0.79, width: 0.88 },
            { name: "ProductRepository.java", height: 0.56, width: 0.65 },
            { name: "CategoryService.java", height: 0.64, width: 0.73 },
            { name: "InventoryManager.java", height: 0.71, width: 0.80 },
            { name: "PriceCalculator.java", height: 0.48, width: 0.57 },
            { name: "DiscountService.java", height: 0.59, width: 0.68 },
            { name: "ImageService.java", height: 0.52, width: 0.61 },
            { name: "SearchService.java", height: 0.77, width: 0.86 },
            { name: "RecommendationEngine.java", height: 0.83, width: 0.92 },
            { name: "ReviewService.java", height: 0.45, width: 0.54 },
            { name: "RatingCalculator.java", height: 0.37, width: 0.46 }
          ]
        },
        {
          name: "notification",
          children: [
            { name: "NotificationController.java", height: 0.73, width: 0.82 },
            { name: "NotificationService.java", height: 0.65, width: 0.74 },
            { name: "EmailService.java", height: 0.69, width: 0.78 },
            { name: "SmsService.java", height: 0.54, width: 0.63 },
            { name: "PushNotificationService.java", height: 0.61, width: 0.70 },
            { name: "TemplateEngine.java", height: 0.48, width: 0.57 },
            { name: "NotificationQueue.java", height: 0.56, width: 0.65 }
          ]
        },
        {
          name: "analytics",
          children: [
            { name: "AnalyticsController.java", height: 0.76, width: 0.85 },
            { name: "AnalyticsService.java", height: 0.82, width: 0.91 },
            { name: "EventTracker.java", height: 0.67, width: 0.76 },
            { name: "MetricsCollector.java", height: 0.59, width: 0.68 },
            { name: "ReportGenerator.java", height: 0.74, width: 0.83 },
            { name: "DashboardService.java", height: 0.71, width: 0.80 },
            { name: "DataAggregator.java", height: 0.63, width: 0.72 },
            { name: "ChartBuilder.java", height: 0.51, width: 0.60 }
          ]
        }
      ]
    },
    {
      name: "frontend",
      children: [
        {
          name: "components",
          children: [
            {
              name: "common",
              children: [
                { name: "Button.tsx", height: 0.32, width: 0.41 },
                { name: "Input.tsx", height: 0.38, width: 0.47 },
                { name: "Modal.tsx", height: 0.55, width: 0.64 },
                { name: "Dropdown.tsx", height: 0.47, width: 0.56 },
                { name: "Card.tsx", height: 0.42, width: 0.51 },
                { name: "Badge.tsx", height: 0.24, width: 0.33 },
                { name: "Avatar.tsx", height: 0.29, width: 0.38 },
                { name: "Tooltip.tsx", height: 0.36, width: 0.45 },
                { name: "Spinner.tsx", height: 0.21, width: 0.30 },
                { name: "Alert.tsx", height: 0.43, width: 0.52 }
              ]
            },
            {
              name: "layout",
              children: [
                { name: "Header.tsx", height: 0.68, width: 0.77 },
                { name: "Footer.tsx", height: 0.51, width: 0.60 },
                { name: "Sidebar.tsx", height: 0.73, width: 0.82 },
                { name: "Navigation.tsx", height: 0.64, width: 0.73 },
                { name: "Container.tsx", height: 0.39, width: 0.48 },
                { name: "Grid.tsx", height: 0.46, width: 0.55 },
                { name: "Breadcrumb.tsx", height: 0.41, width: 0.50 }
              ]
            },
            {
              name: "forms",
              children: [
                { name: "LoginForm.tsx", height: 0.61, width: 0.70 },
                { name: "RegisterForm.tsx", height: 0.69, width: 0.78 },
                { name: "ProfileForm.tsx", height: 0.74, width: 0.83 },
                { name: "CheckoutForm.tsx", height: 0.82, width: 0.91 },
                { name: "SearchForm.tsx", height: 0.48, width: 0.57 },
                { name: "FilterForm.tsx", height: 0.56, width: 0.65 },
                { name: "ContactForm.tsx", height: 0.53, width: 0.62 },
                { name: "FormValidator.tsx", height: 0.44, width: 0.53 }
              ]
            },
            {
              name: "product",
              children: [
                { name: "ProductCard.tsx", height: 0.58, width: 0.67 },
                { name: "ProductList.tsx", height: 0.71, width: 0.80 },
                { name: "ProductDetail.tsx", height: 0.85, width: 0.94 },
                { name: "ProductGallery.tsx", height: 0.63, width: 0.72 },
                { name: "ProductReviews.tsx", height: 0.69, width: 0.78 },
                { name: "ProductFilter.tsx", height: 0.54, width: 0.63 },
                { name: "ProductComparison.tsx", height: 0.76, width: 0.85 }
              ]
            },
            {
              name: "cart",
              children: [
                { name: "CartItem.tsx", height: 0.49, width: 0.58 },
                { name: "CartSummary.tsx", height: 0.61, width: 0.70 },
                { name: "CartDrawer.tsx", height: 0.67, width: 0.76 },
                { name: "CartButton.tsx", height: 0.38, width: 0.47 },
                { name: "EmptyCart.tsx", height: 0.42, width: 0.51 }
              ]
            }
          ]
        },
        {
          name: "pages",
          children: [
            { name: "HomePage.tsx", height: 0.78, width: 0.87 },
            { name: "ProductPage.tsx", height: 0.91, width: 0.97 },
            { name: "CartPage.tsx", height: 0.73, width: 0.82 },
            { name: "CheckoutPage.tsx", height: 0.88, width: 0.95 },
            { name: "ProfilePage.tsx", height: 0.69, width: 0.78 },
            { name: "OrderHistoryPage.tsx", height: 0.76, width: 0.85 },
            { name: "AboutPage.tsx", height: 0.54, width: 0.63 },
            { name: "ContactPage.tsx", height: 0.58, width: 0.67 },
            { name: "NotFoundPage.tsx", height: 0.41, width: 0.50 }
          ]
        },
        {
          name: "store",
          children: [
            { name: "authStore.ts", height: 0.62, width: 0.71 },
            { name: "cartStore.ts", height: 0.71, width: 0.80 },
            { name: "productStore.ts", height: 0.68, width: 0.77 },
            { name: "userStore.ts", height: 0.56, width: 0.65 },
            { name: "notificationStore.ts", height: 0.49, width: 0.58 },
            { name: "uiStore.ts", height: 0.44, width: 0.53 }
          ]
        },
        {
          name: "services",
          children: [
            { name: "api.ts", height: 0.74, width: 0.83 },
            { name: "authService.ts", height: 0.66, width: 0.75 },
            { name: "productService.ts", height: 0.69, width: 0.78 },
            { name: "orderService.ts", height: 0.72, width: 0.81 },
            { name: "userService.ts", height: 0.58, width: 0.67 },
            { name: "storageService.ts", height: 0.47, width: 0.56 },
            { name: "analyticsService.ts", height: 0.53, width: 0.62 }
          ]
        },
        {
          name: "utils",
          children: [
            { name: "formatters.ts", height: 0.51, width: 0.60 },
            { name: "validators.ts", height: 0.58, width: 0.67 },
            { name: "constants.ts", height: 0.36, width: 0.45 },
            { name: "helpers.ts", height: 0.63, width: 0.72 },
            { name: "dateUtils.ts", height: 0.44, width: 0.53 },
            { name: "stringUtils.ts", height: 0.39, width: 0.48 },
            { name: "arrayUtils.ts", height: 0.42, width: 0.51 }
          ]
        },
        {
          name: "hooks",
          children: [
            { name: "useAuth.ts", height: 0.48, width: 0.57 },
            { name: "useCart.ts", height: 0.52, width: 0.61 },
            { name: "useProduct.ts", height: 0.49, width: 0.58 },
            { name: "useDebounce.ts", height: 0.33, width: 0.42 },
            { name: "useLocalStorage.ts", height: 0.41, width: 0.50 },
            { name: "useMediaQuery.ts", height: 0.37, width: 0.46 },
            { name: "useIntersection.ts", height: 0.44, width: 0.53 }
          ]
        }
      ]
    },
    {
      name: "shared",
      children: [
        {
          name: "models",
          children: [
            { name: "User.java", height: 0.56, width: 0.65 },
            { name: "Product.java", height: 0.61, width: 0.70 },
            { name: "Order.java", height: 0.68, width: 0.77 },
            { name: "Payment.java", height: 0.52, width: 0.61 },
            { name: "Address.java", height: 0.44, width: 0.53 },
            { name: "Category.java", height: 0.38, width: 0.47 },
            { name: "Review.java", height: 0.47, width: 0.56 },
            { name: "Notification.java", height: 0.41, width: 0.50 }
          ]
        },
        {
          name: "dto",
          children: [
            { name: "UserDTO.java", height: 0.43, width: 0.52 },
            { name: "ProductDTO.java", height: 0.48, width: 0.57 },
            { name: "OrderDTO.java", height: 0.54, width: 0.63 },
            { name: "PaymentDTO.java", height: 0.41, width: 0.50 },
            { name: "AddressDTO.java", height: 0.36, width: 0.45 },
            { name: "CartItemDTO.java", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "exceptions",
          children: [
            { name: "UserNotFoundException.java", height: 0.28, width: 0.37 },
            { name: "ProductNotFoundException.java", height: 0.31, width: 0.40 },
            { name: "PaymentException.java", height: 0.34, width: 0.43 },
            { name: "ValidationException.java", height: 0.37, width: 0.46 },
            { name: "AuthenticationException.java", height: 0.39, width: 0.48 },
            { name: "OrderException.java", height: 0.33, width: 0.42 }
          ]
        },
        {
          name: "config",
          children: [
            { name: "DatabaseConfig.java", height: 0.58, width: 0.67 },
            { name: "SecurityConfig.java", height: 0.72, width: 0.81 },
            { name: "CacheConfig.java", height: 0.49, width: 0.58 },
            { name: "SwaggerConfig.java", height: 0.54, width: 0.63 },
            { name: "MailConfig.java", height: 0.46, width: 0.55 },
            { name: "SchedulerConfig.java", height: 0.51, width: 0.60 }
          ]
        },
        {
          name: "constants",
          children: [
            { name: "ApiConstants.java", height: 0.32, width: 0.41 },
            { name: "ErrorMessages.java", height: 0.38, width: 0.47 },
            { name: "RoleConstants.java", height: 0.26, width: 0.35 },
            { name: "StatusConstants.java", height: 0.29, width: 0.38 }
          ]
        },
        {
          name: "utils",
          children: [
            { name: "DateUtils.java", height: 0.44, width: 0.53 },
            { name: "StringUtils.java", height: 0.39, width: 0.48 },
            { name: "ValidationUtils.java", height: 0.51, width: 0.60 },
            { name: "EncryptionUtils.java", height: 0.56, width: 0.65 },
            { name: "FileUtils.java", height: 0.48, width: 0.57 },
            { name: "JsonUtils.java", height: 0.42, width: 0.51 }
          ]
        }
      ]
    },
    {
      name: "database",
      children: [
        {
          name: "migrations",
          children: [
            { name: "V1_create_users.sql", height: 0.41, width: 0.50 },
            { name: "V2_create_products.sql", height: 0.46, width: 0.55 },
            { name: "V3_create_orders.sql", height: 0.52, width: 0.61 },
            { name: "V4_create_payments.sql", height: 0.44, width: 0.53 },
            { name: "V5_add_indexes.sql", height: 0.37, width: 0.46 },
            { name: "V6_create_reviews.sql", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "seeds",
          children: [
            { name: "UserSeeder.java", height: 0.48, width: 0.57 },
            { name: "ProductSeeder.java", height: 0.63, width: 0.72 },
            { name: "CategorySeeder.java", height: 0.51, width: 0.60 }
          ]
        }
      ]
    },
    {
      name: "tests",
      children: [
        {
          name: "backend",
          children: [
            {
              name: "unit",
              children: [
                { name: "UserServiceTest.java", height: 0.71, width: 0.80 },
                { name: "ProductServiceTest.java", height: 0.76, width: 0.85 },
                { name: "OrderServiceTest.java", height: 0.79, width: 0.88 },
                { name: "PaymentServiceTest.java", height: 0.73, width: 0.82 },
                { name: "AuthServiceTest.java", height: 0.68, width: 0.77 }
              ]
            },
            {
              name: "integration",
              children: [
                { name: "UserControllerTest.java", height: 0.84, width: 0.93 },
                { name: "ProductControllerTest.java", height: 0.88, width: 0.95 },
                { name: "OrderControllerTest.java", height: 0.91, width: 0.98 },
                { name: "PaymentIntegrationTest.java", height: 0.86, width: 0.94 }
              ]
            }
          ]
        },
        {
          name: "frontend",
          children: [
            {
              name: "unit",
              children: [
                { name: "Button.test.tsx", height: 0.38, width: 0.47 },
                { name: "ProductCard.test.tsx", height: 0.46, width: 0.55 },
                { name: "CartStore.test.ts", height: 0.54, width: 0.63 },
                { name: "formatters.test.ts", height: 0.42, width: 0.51 }
              ]
            },
            {
              name: "e2e",
              children: [
                { name: "login.spec.ts", height: 0.59, width: 0.68 },
                { name: "checkout.spec.ts", height: 0.73, width: 0.82 },
                { name: "product-search.spec.ts", height: 0.64, width: 0.73 }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "docs",
      children: [
        { name: "API.md", height: 0.68, width: 0.77 },
        { name: "ARCHITECTURE.md", height: 0.81, width: 0.90 },
        { name: "SETUP.md", height: 0.54, width: 0.63 },
        { name: "CONTRIBUTING.md", height: 0.61, width: 0.70 },
        { name: "CHANGELOG.md", height: 0.47, width: 0.56 }
      ]
    },
    { name: "README.md", height: 0.58, width: 0.67 },
    { name: "package.json", height: 0.39, width: 0.48 },
    { name: "pom.xml", height: 0.52, width: 0.61 },
    { name: "docker-compose.yml", height: 0.46, width: 0.55 },
    { name: ".gitignore", height: 0.24, width: 0.33 },
    {
  name: "root",
  children: [
    {
      name: "backend",
      children: [
        {
          name: "auth",
          children: [
            { name: "AuthController.java", height: 0.85, width: 0.92 },
            { name: "AuthService.java", height: 0.67, width: 0.78 },
            { name: "TokenManager.java", height: 0.54, width: 0.65 },
            { name: "PasswordEncoder.java", height: 0.43, width: 0.52 },
            { name: "JwtProvider.java", height: 0.71, width: 0.83 },
            { name: "OAuth2Handler.java", height: 0.58, width: 0.69 },
            { name: "SessionManager.java", height: 0.46, width: 0.57 },
            { name: "RefreshTokenService.java", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "user",
          children: [
            { name: "UserController.java", height: 0.91, width: 0.95 },
            { name: "UserService.java", height: 0.78, width: 0.87 },
            { name: "UserRepository.java", height: 0.52, width: 0.61 },
            { name: "UserMapper.java", height: 0.34, width: 0.43 },
            { name: "UserValidator.java", height: 0.47, width: 0.56 },
            { name: "ProfileService.java", height: 0.63, width: 0.74 },
            { name: "AvatarService.java", height: 0.41, width: 0.50 },
            { name: "UserPreferences.java", height: 0.28, width: 0.37 },
            { name: "NotificationSettings.java", height: 0.35, width: 0.44 }
          ]
        },
        {
          name: "payment",
          children: [
            { name: "PaymentController.java", height: 0.88, width: 0.93 },
            { name: "PaymentService.java", height: 0.76, width: 0.85 },
            { name: "StripeAdapter.java", height: 0.69, width: 0.78 },
            { name: "PayPalAdapter.java", height: 0.64, width: 0.73 },
            { name: "TransactionLogger.java", height: 0.51, width: 0.60 },
            { name: "RefundService.java", height: 0.57, width: 0.66 },
            { name: "InvoiceGenerator.java", height: 0.72, width: 0.81 },
            { name: "PaymentValidator.java", height: 0.44, width: 0.53 },
            { name: "CurrencyConverter.java", height: 0.38, width: 0.47 },
            { name: "SubscriptionManager.java", height: 0.82, width: 0.91 }
          ]
        },
        {
          name: "order",
          children: [
            { name: "OrderController.java", height: 0.93, width: 0.98 },
            { name: "OrderService.java", height: 0.81, width: 0.90 },
            { name: "OrderRepository.java", height: 0.55, width: 0.64 },
            { name: "CartService.java", height: 0.68, width: 0.77 },
            { name: "CheckoutService.java", height: 0.74, width: 0.83 },
            { name: "ShippingCalculator.java", height: 0.49, width: 0.58 },
            { name: "OrderValidator.java", height: 0.42, width: 0.51 },
            { name: "OrderStatusTracker.java", height: 0.61, width: 0.70 },
            { name: "DeliveryService.java", height: 0.66, width: 0.75 },
            { name: "ReturnHandler.java", height: 0.53, width: 0.62 }
          ]
        },
        {
          name: "product",
          children: [
            { name: "ProductController.java", height: 0.87, width: 0.94 },
            { name: "ProductService.java", height: 0.79, width: 0.88 },
            { name: "ProductRepository.java", height: 0.56, width: 0.65 },
            { name: "CategoryService.java", height: 0.64, width: 0.73 },
            { name: "InventoryManager.java", height: 0.71, width: 0.80 },
            { name: "PriceCalculator.java", height: 0.48, width: 0.57 },
            { name: "DiscountService.java", height: 0.59, width: 0.68 },
            { name: "ImageService.java", height: 0.52, width: 0.61 },
            { name: "SearchService.java", height: 0.77, width: 0.86 },
            { name: "RecommendationEngine.java", height: 0.83, width: 0.92 },
            { name: "ReviewService.java", height: 0.45, width: 0.54 },
            { name: "RatingCalculator.java", height: 0.37, width: 0.46 }
          ]
        },
        {
          name: "notification",
          children: [
            { name: "NotificationController.java", height: 0.73, width: 0.82 },
            { name: "NotificationService.java", height: 0.65, width: 0.74 },
            { name: "EmailService.java", height: 0.69, width: 0.78 },
            { name: "SmsService.java", height: 0.54, width: 0.63 },
            { name: "PushNotificationService.java", height: 0.61, width: 0.70 },
            { name: "TemplateEngine.java", height: 0.48, width: 0.57 },
            { name: "NotificationQueue.java", height: 0.56, width: 0.65 }
          ]
        },
        {
          name: "analytics",
          children: [
            { name: "AnalyticsController.java", height: 0.76, width: 0.85 },
            { name: "AnalyticsService.java", height: 0.82, width: 0.91 },
            { name: "EventTracker.java", height: 0.67, width: 0.76 },
            { name: "MetricsCollector.java", height: 0.59, width: 0.68 },
            { name: "ReportGenerator.java", height: 0.74, width: 0.83 },
            { name: "DashboardService.java", height: 0.71, width: 0.80 },
            { name: "DataAggregator.java", height: 0.63, width: 0.72 },
            { name: "ChartBuilder.java", height: 0.51, width: 0.60 }
          ]
        }
      ]
    },
    {
      name: "frontend",
      children: [
        {
          name: "components",
          children: [
            {
              name: "common",
              children: [
                { name: "Button.tsx", height: 0.32, width: 0.41 },
                { name: "Input.tsx", height: 0.38, width: 0.47 },
                { name: "Modal.tsx", height: 0.55, width: 0.64 },
                { name: "Dropdown.tsx", height: 0.47, width: 0.56 },
                { name: "Card.tsx", height: 0.42, width: 0.51 },
                { name: "Badge.tsx", height: 0.24, width: 0.33 },
                { name: "Avatar.tsx", height: 0.29, width: 0.38 },
                { name: "Tooltip.tsx", height: 0.36, width: 0.45 },
                { name: "Spinner.tsx", height: 0.21, width: 0.30 },
                { name: "Alert.tsx", height: 0.43, width: 0.52 }
              ]
            },
            {
              name: "layout",
              children: [
                { name: "Header.tsx", height: 0.68, width: 0.77 },
                { name: "Footer.tsx", height: 0.51, width: 0.60 },
                { name: "Sidebar.tsx", height: 0.73, width: 0.82 },
                { name: "Navigation.tsx", height: 0.64, width: 0.73 },
                { name: "Container.tsx", height: 0.39, width: 0.48 },
                { name: "Grid.tsx", height: 0.46, width: 0.55 },
                { name: "Breadcrumb.tsx", height: 0.41, width: 0.50 }
              ]
            },
            {
              name: "forms",
              children: [
                { name: "LoginForm.tsx", height: 0.61, width: 0.70 },
                { name: "RegisterForm.tsx", height: 0.69, width: 0.78 },
                { name: "ProfileForm.tsx", height: 0.74, width: 0.83 },
                { name: "CheckoutForm.tsx", height: 0.82, width: 0.91 },
                { name: "SearchForm.tsx", height: 0.48, width: 0.57 },
                { name: "FilterForm.tsx", height: 0.56, width: 0.65 },
                { name: "ContactForm.tsx", height: 0.53, width: 0.62 },
                { name: "FormValidator.tsx", height: 0.44, width: 0.53 }
              ]
            },
            {
              name: "product",
              children: [
                { name: "ProductCard.tsx", height: 0.58, width: 0.67 },
                { name: "ProductList.tsx", height: 0.71, width: 0.80 },
                { name: "ProductDetail.tsx", height: 0.85, width: 0.94 },
                { name: "ProductGallery.tsx", height: 0.63, width: 0.72 },
                { name: "ProductReviews.tsx", height: 0.69, width: 0.78 },
                { name: "ProductFilter.tsx", height: 0.54, width: 0.63 },
                { name: "ProductComparison.tsx", height: 0.76, width: 0.85 }
              ]
            },
            {
              name: "cart",
              children: [
                { name: "CartItem.tsx", height: 0.49, width: 0.58 },
                { name: "CartSummary.tsx", height: 0.61, width: 0.70 },
                { name: "CartDrawer.tsx", height: 0.67, width: 0.76 },
                { name: "CartButton.tsx", height: 0.38, width: 0.47 },
                { name: "EmptyCart.tsx", height: 0.42, width: 0.51 }
              ]
            }
          ]
        },
        {
          name: "pages",
          children: [
            { name: "HomePage.tsx", height: 0.78, width: 0.87 },
            { name: "ProductPage.tsx", height: 0.91, width: 0.97 },
            { name: "CartPage.tsx", height: 0.73, width: 0.82 },
            { name: "CheckoutPage.tsx", height: 0.88, width: 0.95 },
            { name: "ProfilePage.tsx", height: 0.69, width: 0.78 },
            { name: "OrderHistoryPage.tsx", height: 0.76, width: 0.85 },
            { name: "AboutPage.tsx", height: 0.54, width: 0.63 },
            { name: "ContactPage.tsx", height: 0.58, width: 0.67 },
            { name: "NotFoundPage.tsx", height: 0.41, width: 0.50 }
          ]
        },
        {
          name: "store",
          children: [
            { name: "authStore.ts", height: 0.62, width: 0.71 },
            { name: "cartStore.ts", height: 0.71, width: 0.80 },
            { name: "productStore.ts", height: 0.68, width: 0.77 },
            { name: "userStore.ts", height: 0.56, width: 0.65 },
            { name: "notificationStore.ts", height: 0.49, width: 0.58 },
            { name: "uiStore.ts", height: 0.44, width: 0.53 }
          ]
        },
        {
          name: "services",
          children: [
            { name: "api.ts", height: 0.74, width: 0.83 },
            { name: "authService.ts", height: 0.66, width: 0.75 },
            { name: "productService.ts", height: 0.69, width: 0.78 },
            { name: "orderService.ts", height: 0.72, width: 0.81 },
            { name: "userService.ts", height: 0.58, width: 0.67 },
            { name: "storageService.ts", height: 0.47, width: 0.56 },
            { name: "analyticsService.ts", height: 0.53, width: 0.62 }
          ]
        },
        {
          name: "utils",
          children: [
            { name: "formatters.ts", height: 0.51, width: 0.60 },
            { name: "validators.ts", height: 0.58, width: 0.67 },
            { name: "constants.ts", height: 0.36, width: 0.45 },
            { name: "helpers.ts", height: 0.63, width: 0.72 },
            { name: "dateUtils.ts", height: 0.44, width: 0.53 },
            { name: "stringUtils.ts", height: 0.39, width: 0.48 },
            { name: "arrayUtils.ts", height: 0.42, width: 0.51 }
          ]
        },
        {
          name: "hooks",
          children: [
            { name: "useAuth.ts", height: 0.48, width: 0.57 },
            { name: "useCart.ts", height: 0.52, width: 0.61 },
            { name: "useProduct.ts", height: 0.49, width: 0.58 },
            { name: "useDebounce.ts", height: 0.33, width: 0.42 },
            { name: "useLocalStorage.ts", height: 0.41, width: 0.50 },
            { name: "useMediaQuery.ts", height: 0.37, width: 0.46 },
            { name: "useIntersection.ts", height: 0.44, width: 0.53 }
          ]
        }
      ]
    },
    {
      name: "shared",
      children: [
        {
          name: "models",
          children: [
            { name: "User.java", height: 0.56, width: 0.65 },
            { name: "Product.java", height: 0.61, width: 0.70 },
            { name: "Order.java", height: 0.68, width: 0.77 },
            { name: "Payment.java", height: 0.52, width: 0.61 },
            { name: "Address.java", height: 0.44, width: 0.53 },
            { name: "Category.java", height: 0.38, width: 0.47 },
            { name: "Review.java", height: 0.47, width: 0.56 },
            { name: "Notification.java", height: 0.41, width: 0.50 }
          ]
        },
        {
          name: "dto",
          children: [
            { name: "UserDTO.java", height: 0.43, width: 0.52 },
            { name: "ProductDTO.java", height: 0.48, width: 0.57 },
            { name: "OrderDTO.java", height: 0.54, width: 0.63 },
            { name: "PaymentDTO.java", height: 0.41, width: 0.50 },
            { name: "AddressDTO.java", height: 0.36, width: 0.45 },
            { name: "CartItemDTO.java", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "exceptions",
          children: [
            { name: "UserNotFoundException.java", height: 0.28, width: 0.37 },
            { name: "ProductNotFoundException.java", height: 0.31, width: 0.40 },
            { name: "PaymentException.java", height: 0.34, width: 0.43 },
            { name: "ValidationException.java", height: 0.37, width: 0.46 },
            { name: "AuthenticationException.java", height: 0.39, width: 0.48 },
            { name: "OrderException.java", height: 0.33, width: 0.42 }
          ]
        },
        {
          name: "config",
          children: [
            { name: "DatabaseConfig.java", height: 0.58, width: 0.67 },
            { name: "SecurityConfig.java", height: 0.72, width: 0.81 },
            { name: "CacheConfig.java", height: 0.49, width: 0.58 },
            { name: "SwaggerConfig.java", height: 0.54, width: 0.63 },
            { name: "MailConfig.java", height: 0.46, width: 0.55 },
            { name: "SchedulerConfig.java", height: 0.51, width: 0.60 }
          ]
        },
        {
          name: "constants",
          children: [
            { name: "ApiConstants.java", height: 0.32, width: 0.41 },
            { name: "ErrorMessages.java", height: 0.38, width: 0.47 },
            { name: "RoleConstants.java", height: 0.26, width: 0.35 },
            { name: "StatusConstants.java", height: 0.29, width: 0.38 }
          ]
        },
        {
          name: "utils",
          children: [
            { name: "DateUtils.java", height: 0.44, width: 0.53 },
            { name: "StringUtils.java", height: 0.39, width: 0.48 },
            { name: "ValidationUtils.java", height: 0.51, width: 0.60 },
            { name: "EncryptionUtils.java", height: 0.56, width: 0.65 },
            { name: "FileUtils.java", height: 0.48, width: 0.57 },
            { name: "JsonUtils.java", height: 0.42, width: 0.51 }
          ]
        }
      ]
    },
    {
      name: "database",
      children: [
        {
          name: "migrations",
          children: [
            { name: "V1_create_users.sql", height: 0.41, width: 0.50 },
            { name: "V2_create_products.sql", height: 0.46, width: 0.55 },
            { name: "V3_create_orders.sql", height: 0.52, width: 0.61 },
            { name: "V4_create_payments.sql", height: 0.44, width: 0.53 },
            { name: "V5_add_indexes.sql", height: 0.37, width: 0.46 },
            { name: "V6_create_reviews.sql", height: 0.39, width: 0.48 }
          ]
        },
        {
          name: "seeds",
          children: [
            { name: "UserSeeder.java", height: 0.48, width: 0.57 },
            { name: "ProductSeeder.java", height: 0.63, width: 0.72 },
            { name: "CategorySeeder.java", height: 0.51, width: 0.60 }
          ]
        }
      ]
    },
    {
      name: "tests",
      children: [
        {
          name: "backend",
          children: [
            {
              name: "unit",
              children: [
                { name: "UserServiceTest.java", height: 0.71, width: 0.80 },
                { name: "ProductServiceTest.java", height: 0.76, width: 0.85 },
                { name: "OrderServiceTest.java", height: 0.79, width: 0.88 },
                { name: "PaymentServiceTest.java", height: 0.73, width: 0.82 },
                { name: "AuthServiceTest.java", height: 0.68, width: 0.77 }
              ]
            },
            {
              name: "integration",
              children: [
                { name: "UserControllerTest.java", height: 0.84, width: 0.93 },
                { name: "ProductControllerTest.java", height: 0.88, width: 0.95 },
                { name: "OrderControllerTest.java", height: 0.91, width: 0.98 },
                { name: "PaymentIntegrationTest.java", height: 0.86, width: 0.94 }
              ]
            }
          ]
        },
        {
          name: "frontend",
          children: [
            {
              name: "unit",
              children: [
                { name: "Button.test.tsx", height: 0.38, width: 0.47 },
                { name: "ProductCard.test.tsx", height: 0.46, width: 0.55 },
                { name: "CartStore.test.ts", height: 0.54, width: 0.63 },
                { name: "formatters.test.ts", height: 0.42, width: 0.51 }
              ]
            },
            {
              name: "e2e",
              children: [
                { name: "login.spec.ts", height: 0.59, width: 0.68 },
                { name: "checkout.spec.ts", height: 0.73, width: 0.82 },
                { name: "product-search.spec.ts", height: 0.64, width: 0.73 }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "docs",
      children: [
        { name: "API.md", height: 0.68, width: 0.77 },
        { name: "ARCHITECTURE.md", height: 0.81, width: 0.90 },
        { name: "SETUP.md", height: 0.54, width: 0.63 },
        { name: "CONTRIBUTING.md", height: 0.61, width: 0.70 },
        { name: "CHANGELOG.md", height: 0.47, width: 0.56 }
      ]
    },
    { name: "README.md", height: 0.58, width: 0.67 },
    { name: "package.json", height: 0.39, width: 0.48 },
    { name: "pom.xml", height: 0.52, width: 0.61 },
    { name: "docker-compose.yml", height: 0.46, width: 0.55 },
    { name: ".gitignore", height: 0.24, width: 0.33 }
  ]
}
  ]
}
  ]
}
  ]
})

function handleBuildingClick(name: string, data: any) {
  console.log('Clicked on:', name, data)
}
</script>

<template>
  <div class="project-view">
    <CodeCity 
      :data="cityDataBig"
      @buildingClick="handleBuildingClick"
    />
  </div>
</template>

<style scoped>
.project-view {
  width: 100vw;
  height: 100vh;
}
</style>