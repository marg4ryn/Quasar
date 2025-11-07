<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import CodeCity from '@/components/visuals/CodeCity.vue'
  import { useCodeCityController } from '@/composables/useCodeCityController'

  const { selectBuilding } = useCodeCityController()

  // Tymczasowe dane testowe
  const cityData = ref({
    name: 'root', type: "directory", path: "/",
    children: [
      {
        name: 'internal', type: "directory", path: "/internal",
        children: [
          { name: 'SessionImpl.java', type: "file", path: "/internal/SessionImpl.java", height: 0.8, width: 0.49 },
          { name: 'SessionFactoryImpl.java', type: "file", path: "/internal/SessionFactoryImpl.java", height: 0.2, width: 0.43 },
          { name: 'Transaction.java', type: "file", path: "/internal/Transaction.java", height: 0.4, width: 0.35 },
          { name: 'Cache.java', type: "file", path: "/internal/Cache.java", height: 0.55, width: 0.55 },
        ],
      },
      {
        name: 'api', type: "directory", path: "/api",
        children: [
          { name: 'UserService.java', type: "file", path: "/api/UserService.java", height: 0.94, width: 0.6 },
          { name: 'AuthService.java', type: "file", path: "/api/AuthService.java", height: 0.12, width: 0.7 },
        ],
      },
      { name: 'Main.java', type: "file", path: "/Main.java", height: 0.33, width: 0.85 },
    ],
  })

  const cityDataBig = ref({
    name: 'root', 
    type: "directory", 
    path: "/",
    children: [
      {
        name: 'src', 
        type: "directory", 
        path: "/src",
        children: [
          {
            name: 'main',
            type: "directory",
            path: "/src/main",
            children: [
              {
                name: 'java',
                type: "directory",
                path: "/src/main/java",
                children: [
                  {
                    name: 'com',
                    type: "directory",
                    path: "/src/main/java/com",
                    children: [
                      {
                        name: 'company',
                        type: "directory",
                        path: "/src/main/java/com/company",
                        children: [
                          {
                            name: 'api',
                            type: "directory",
                            path: "/src/main/java/com/company/api",
                            children: [
                              { name: 'UserController.java', type: "file", path: "/src/main/java/com/company/api/UserController.java", height: 0.75, width: 0.68 },
                              { name: 'AuthController.java', type: "file", path: "/src/main/java/com/company/api/AuthController.java", height: 0.82, width: 0.71 },
                              { name: 'ProductController.java', type: "file", path: "/src/main/java/com/company/api/ProductController.java", height: 0.91, width: 0.78 },
                              { name: 'OrderController.java', type: "file", path: "/src/main/java/com/company/api/OrderController.java", height: 0.88, width: 0.65 },
                              { name: 'PaymentController.java', type: "file", path: "/src/main/java/com/company/api/PaymentController.java", height: 0.69, width: 0.59 },
                            ]
                          },
                          {
                            name: 'service',
                            type: "directory",
                            path: "/src/main/java/com/company/service",
                            children: [
                              { name: 'UserService.java', type: "file", path: "/src/main/java/com/company/service/UserService.java", height: 0.94, width: 0.82 },
                              { name: 'AuthService.java', type: "file", path: "/src/main/java/com/company/service/AuthService.java", height: 0.87, width: 0.75 },
                              { name: 'ProductService.java', type: "file", path: "/src/main/java/com/company/service/ProductService.java", height: 0.96, width: 0.88 },
                              { name: 'OrderService.java', type: "file", path: "/src/main/java/com/company/service/OrderService.java", height: 0.92, width: 0.79 },
                              { name: 'PaymentService.java', type: "file", path: "/src/main/java/com/company/service/PaymentService.java", height: 0.85, width: 0.73 },
                              { name: 'EmailService.java', type: "file", path: "/src/main/java/com/company/service/EmailService.java", height: 0.61, width: 0.54 },
                              { name: 'NotificationService.java', type: "file", path: "/src/main/java/com/company/service/NotificationService.java", height: 0.72, width: 0.66 },
                            ]
                          },
                          {
                            name: 'repository',
                            type: "directory",
                            path: "/src/main/java/com/company/repository",
                            children: [
                              { name: 'UserRepository.java', type: "file", path: "/src/main/java/com/company/repository/UserRepository.java", height: 0.45, width: 0.52 },
                              { name: 'ProductRepository.java', type: "file", path: "/src/main/java/com/company/repository/ProductRepository.java", height: 0.48, width: 0.55 },
                              { name: 'OrderRepository.java', type: "file", path: "/src/main/java/com/company/repository/OrderRepository.java", height: 0.43, width: 0.49 },
                              { name: 'PaymentRepository.java', type: "file", path: "/src/main/java/com/company/repository/PaymentRepository.java", height: 0.41, width: 0.47 },
                            ]
                          },
                          {
                            name: 'model',
                            type: "directory",
                            path: "/src/main/java/com/company/model",
                            children: [
                              { name: 'User.java', type: "file", path: "/src/main/java/com/company/model/User.java", height: 0.68, width: 0.61 },
                              { name: 'Product.java', type: "file", path: "/src/main/java/com/company/model/Product.java", height: 0.71, width: 0.64 },
                              { name: 'Order.java', type: "file", path: "/src/main/java/com/company/model/Order.java", height: 0.73, width: 0.67 },
                              { name: 'Payment.java', type: "file", path: "/src/main/java/com/company/model/Payment.java", height: 0.58, width: 0.53 },
                              { name: 'Address.java', type: "file", path: "/src/main/java/com/company/model/Address.java", height: 0.39, width: 0.42 },
                              { name: 'Category.java', type: "file", path: "/src/main/java/com/company/model/Category.java", height: 0.44, width: 0.48 },
                            ]
                          },
                          {
                            name: 'dto',
                            type: "directory",
                            path: "/src/main/java/com/company/dto",
                            children: [
                              { name: 'UserDTO.java', type: "file", path: "/src/main/java/com/company/dto/UserDTO.java", height: 0.52, width: 0.49 },
                              { name: 'ProductDTO.java', type: "file", path: "/src/main/java/com/company/dto/ProductDTO.java", height: 0.54, width: 0.51 },
                              { name: 'OrderDTO.java', type: "file", path: "/src/main/java/com/company/dto/OrderDTO.java", height: 0.56, width: 0.52 },
                              { name: 'PaymentDTO.java', type: "file", path: "/src/main/java/com/company/dto/PaymentDTO.java", height: 0.47, width: 0.45 },
                              { name: 'LoginRequest.java', type: "file", path: "/src/main/java/com/company/dto/LoginRequest.java", height: 0.28, width: 0.32 },
                              { name: 'RegisterRequest.java', type: "file", path: "/src/main/java/com/company/dto/RegisterRequest.java", height: 0.32, width: 0.36 },
                            ]
                          },
                          {
                            name: 'config',
                            type: "directory",
                            path: "/src/main/java/com/company/config",
                            children: [
                              { name: 'SecurityConfig.java', type: "file", path: "/src/main/java/com/company/config/SecurityConfig.java", height: 0.79, width: 0.72 },
                              { name: 'DatabaseConfig.java', type: "file", path: "/src/main/java/com/company/config/DatabaseConfig.java", height: 0.65, width: 0.58 },
                              { name: 'WebConfig.java', type: "file", path: "/src/main/java/com/company/config/WebConfig.java", height: 0.57, width: 0.51 },
                              { name: 'CacheConfig.java', type: "file", path: "/src/main/java/com/company/config/CacheConfig.java", height: 0.48, width: 0.44 },
                            ]
                          },
                          {
                            name: 'util',
                            type: "directory",
                            path: "/src/main/java/com/company/util",
                            children: [
                              { name: 'JwtUtil.java', type: "file", path: "/src/main/java/com/company/util/JwtUtil.java", height: 0.83, width: 0.76 },
                              { name: 'PasswordEncoder.java', type: "file", path: "/src/main/java/com/company/util/PasswordEncoder.java", height: 0.41, width: 0.39 },
                              { name: 'ValidationUtil.java', type: "file", path: "/src/main/java/com/company/util/ValidationUtil.java", height: 0.59, width: 0.54 },
                              { name: 'DateUtil.java', type: "file", path: "/src/main/java/com/company/util/DateUtil.java", height: 0.36, width: 0.38 },
                              { name: 'StringUtil.java', type: "file", path: "/src/main/java/com/company/util/StringUtil.java", height: 0.44, width: 0.42 },
                            ]
                          },
                          {
                            name: 'exception',
                            type: "directory",
                            path: "/src/main/java/com/company/exception",
                            children: [
                              { name: 'GlobalExceptionHandler.java', type: "file", path: "/src/main/java/com/company/exception/GlobalExceptionHandler.java", height: 0.72, width: 0.67 },
                              { name: 'ResourceNotFoundException.java', type: "file", path: "/src/main/java/com/company/exception/ResourceNotFoundException.java", height: 0.24, width: 0.29 },
                              { name: 'ValidationException.java', type: "file", path: "/src/main/java/com/company/exception/ValidationException.java", height: 0.22, width: 0.27 },
                              { name: 'AuthenticationException.java', type: "file", path: "/src/main/java/com/company/exception/AuthenticationException.java", height: 0.26, width: 0.31 },
                            ]
                          },
                          { name: 'Application.java', type: "file", path: "/src/main/java/com/company/Application.java", height: 0.38, width: 0.45 },
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'resources',
                type: "directory",
                path: "/src/main/resources",
                children: [
                  { name: 'application.properties', type: "file", path: "/src/main/resources/application.properties", height: 0.51, width: 0.47 },
                  { name: 'application-dev.properties', type: "file", path: "/src/main/resources/application-dev.properties", height: 0.43, width: 0.41 },
                  { name: 'application-prod.properties', type: "file", path: "/src/main/resources/application-prod.properties", height: 0.46, width: 0.43 },
                  {
                    name: 'db',
                    type: "directory",
                    path: "/src/main/resources/db",
                    children: [
                      {
                        name: 'migration',
                        type: "directory",
                        path: "/src/main/resources/db/migration",
                        children: [
                          { name: 'V1__create_users_table.sql', type: "file", path: "/src/main/resources/db/migration/V1__create_users_table.sql", height: 0.34, width: 0.38 },
                          { name: 'V2__create_products_table.sql', type: "file", path: "/src/main/resources/db/migration/V2__create_products_table.sql", height: 0.36, width: 0.39 },
                          { name: 'V3__create_orders_table.sql', type: "file", path: "/src/main/resources/db/migration/V3__create_orders_table.sql", height: 0.38, width: 0.41 },
                        ]
                      }
                    ]
                  },
                  {
                    name: 'static',
                    type: "directory",
                    path: "/src/main/resources/static",
                    children: [
                      { name: 'index.html', type: "file", path: "/src/main/resources/static/index.html", height: 0.29, width: 0.33 },
                      { name: 'styles.css', type: "file", path: "/src/main/resources/static/styles.css", height: 0.42, width: 0.44 },
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'test',
            type: "directory",
            path: "/src/test",
            children: [
              {
                name: 'java',
                type: "directory",
                path: "/src/test/java",
                children: [
                  {
                    name: 'com',
                    type: "directory",
                    path: "/src/test/java/com",
                    children: [
                      {
                        name: 'company',
                        type: "directory",
                        path: "/src/test/java/com/company",
                        children: [
                          {
                            name: 'service',
                            type: "directory",
                            path: "/src/test/java/com/company/service",
                            children: [
                              { name: 'UserServiceTest.java', type: "file", path: "/src/test/java/com/company/service/UserServiceTest.java", height: 0.88, width: 0.79 },
                              { name: 'AuthServiceTest.java', type: "file", path: "/src/test/java/com/company/service/AuthServiceTest.java", height: 0.82, width: 0.74 },
                              { name: 'ProductServiceTest.java', type: "file", path: "/src/test/java/com/company/service/ProductServiceTest.java", height: 0.91, width: 0.83 },
                              { name: 'OrderServiceTest.java', type: "file", path: "/src/test/java/com/company/service/OrderServiceTest.java", height: 0.86, width: 0.77 },
                            ]
                          },
                          {
                            name: 'api',
                            type: "directory",
                            path: "/src/test/java/com/company/api",
                            children: [
                              { name: 'UserControllerTest.java', type: "file", path: "/src/test/java/com/company/api/UserControllerTest.java", height: 0.76, width: 0.69 },
                              { name: 'AuthControllerTest.java', type: "file", path: "/src/test/java/com/company/api/AuthControllerTest.java", height: 0.73, width: 0.67 },
                              { name: 'ProductControllerTest.java', type: "file", path: "/src/test/java/com/company/api/ProductControllerTest.java", height: 0.78, width: 0.71 },
                            ]
                          },
                          {
                            name: 'integration',
                            type: "directory",
                            path: "/src/test/java/com/company/integration",
                            children: [
                              { name: 'UserIntegrationTest.java', type: "file", path: "/src/test/java/com/company/integration/UserIntegrationTest.java", height: 0.94, width: 0.87 },
                              { name: 'OrderIntegrationTest.java', type: "file", path: "/src/test/java/com/company/integration/OrderIntegrationTest.java", height: 0.89, width: 0.81 },
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'docs',
        type: "directory",
        path: "/docs",
        children: [
          { name: 'README.md', type: "file", path: "/docs/README.md", height: 0.67, width: 0.62 },
          { name: 'CONTRIBUTING.md', type: "file", path: "/docs/CONTRIBUTING.md", height: 0.54, width: 0.51 },
          { name: 'API.md', type: "file", path: "/docs/API.md", height: 0.78, width: 0.73 },
          {
            name: 'architecture',
            type: "directory",
            path: "/docs/architecture",
            children: [
              { name: 'overview.md', type: "file", path: "/docs/architecture/overview.md", height: 0.63, width: 0.58 },
              { name: 'database-schema.md', type: "file", path: "/docs/architecture/database-schema.md", height: 0.71, width: 0.66 },
            ]
          }
        ]
      },
      {
        name: 'scripts',
        type: "directory",
        path: "/scripts",
        children: [
          { name: 'build.sh', type: "file", path: "/scripts/build.sh", height: 0.41, width: 0.43 },
          { name: 'deploy.sh', type: "file", path: "/scripts/deploy.sh", height: 0.48, width: 0.49 },
          { name: 'test.sh', type: "file", path: "/scripts/test.sh", height: 0.36, width: 0.39 },
        ]
      },
      { name: 'pom.xml', type: "file", path: "/pom.xml", height: 0.85, width: 0.78 },
      { name: '.gitignore', type: "file", path: "/.gitignore", height: 0.18, width: 0.24 },
      { name: 'README.md', type: "file", path: "/README.md", height: 0.59, width: 0.56 },
    ],
  })

  const colorData = ref([
    { path: "/api/UserService.java", color: 0xbf1b1b, intensity: 0.9 },
    { path: "/internal/Cache.java", color: 0xbf1b1b, intensity: 0.5 }, 
    { path: "/Main.java", color: 0xbf1b1b, intensity: 0.2 }            
  ])

  const colorDataBig = ref([
    { path: "/src/main/java/com/company/service/UserService.java", color: 0xbf1b1b, intensity: 0.95 },
    { path: "/src/main/java/com/company/service/ProductService.java", color: 0xbf1b1b, intensity: 0.88 },
    { path: "/src/main/java/com/company/api/OrderController.java", color: 0xbf1b1b, intensity: 0.82 },
    { path: "/src/main/java/com/company/util/JwtUtil.java", color: 0xbf1b1b, intensity: 0.76 },
    { path: "/src/main/java/com/company/config/SecurityConfig.java", color: 0xbf1b1b, intensity: 0.71 },
    { path: "/src/main/java/com/company/service/OrderService.java", color: 0xbf1b1b, intensity: 0.65 },
    { path: "/src/main/java/com/company/exception/GlobalExceptionHandler.java", color: 0xbf1b1b, intensity: 0.58 },
    { path: "/src/test/java/com/company/integration/UserIntegrationTest.java", color: 0xbf1b1b, intensity: 0.52 },
    { path: "/src/main/java/com/company/api/ProductController.java", color: 0xbf1b1b, intensity: 0.46 },
    { path: "/src/main/java/com/company/service/PaymentService.java", color: 0xbf1b1b, intensity: 0.39 },
    { path: "/src/test/java/com/company/service/ProductServiceTest.java", color: 0xbf1b1b, intensity: 0.33 },
    { path: "/src/main/java/com/company/model/Order.java", color: 0xbf1b1b, intensity: 0.27 },
    { path: "/docs/API.md", color: 0xbf1b1b, intensity: 0.21 },
    { path: "/pom.xml", color: 0xbf1b1b, intensity: 0.15 }
  ])

  function handleBuildingClick(name: string, path: string, intensity?: number) {
    console.log('Clicked on:', name, ' Path:', path, ' Intensity: ', intensity)
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'c' || e.key === 'C') {
      const success = selectBuilding(
        '/src/main/java/com/company/service/UserService.java'
      )
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })

</script>

<template>
  <div class="project-view">
    <CodeCity 
      :data="cityDataBig"
      :colorData="colorDataBig"
      @buildingClick="handleBuildingClick"
    />
  </div>
</template>

<style scoped>
  .project-view {
    width: 60vw;
    height: 80vh;
  }
</style>
