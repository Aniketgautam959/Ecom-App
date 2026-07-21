<nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
    <div class="sb-sidenav-menu">
        <div class="nav">
            <div class="sb-sidenav-menu-heading">Core</div>
            <a class="nav-link" href="{{ url('admin/dashboard') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                Dashboard
            </a>

            <div class="sb-sidenav-menu-heading">Catalog</div>
            <a class="nav-link {{ request()->routeIs('admin.products.*') ? 'active' : '' }}" href="{{ route('admin.products.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-box"></i></div>
                Products
            </a>
            <a class="nav-link {{ request()->routeIs('admin.categories.*') ? 'active' : '' }}" href="{{ route('admin.categories.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-tags"></i></div>
                Categories
            </a>
            <a class="nav-link {{ request()->routeIs('admin.brands.*') ? 'active' : '' }}" href="{{ route('admin.brands.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-copyright"></i></div>
                Brands
            </a>

            <div class="sb-sidenav-menu-heading">Sales</div>
            <a class="nav-link {{ request()->routeIs('admin.orders.*') ? 'active' : '' }}" href="{{ route('admin.orders.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-shopping-bag"></i></div>
                Orders
            </a>
            <a class="nav-link {{ request()->routeIs('admin.customers.*') ? 'active' : '' }}" href="{{ route('admin.customers.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-users"></i></div>
                Customers
            </a>
            <a class="nav-link {{ request()->routeIs('admin.coupons.*') ? 'active' : '' }}" href="{{ route('admin.coupons.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-ticket-alt"></i></div>
                Coupons
            </a>
            <a class="nav-link {{ request()->routeIs('admin.shipping-methods.*') ? 'active' : '' }}" href="{{ route('admin.shipping-methods.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-shipping-fast"></i></div>
                Shipping
            </a>
            <a class="nav-link {{ request()->routeIs('admin.reports.*') ? 'active' : '' }}" href="{{ route('admin.reports.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-chart-bar"></i></div>
                Reports
            </a>

            <div class="sb-sidenav-menu-heading">Engagement</div>
            <a class="nav-link {{ request()->routeIs('admin.banners.*') ? 'active' : '' }}" href="{{ route('admin.banners.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-images"></i></div>
                Banners
            </a>
            <a class="nav-link {{ request()->routeIs('admin.menus.*') ? 'active' : '' }}" href="{{ route('admin.menus.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-bars"></i></div>
                Menus
            </a>
            <a class="nav-link {{ request()->routeIs('admin.reviews.*') ? 'active' : '' }}" href="{{ route('admin.reviews.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-star"></i></div>
                Reviews
            </a>
            <a class="nav-link {{ request()->routeIs('admin.notifications.*') ? 'active' : '' }}" href="{{ route('admin.notifications.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-bell"></i></div>
                Notifications
            </a>
            <a class="nav-link {{ request()->routeIs('admin.pages.*') ? 'active' : '' }}" href="{{ route('admin.pages.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-file-alt"></i></div>
                CMS Pages
            </a>

            <div class="sb-sidenav-menu-heading">Configuration</div>
            <a class="nav-link {{ request()->routeIs('admin.payment-gateways.*') ? 'active' : '' }}" href="{{ route('admin.payment-gateways.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-credit-card"></i></div>
                Payment Gateways
            </a>
            <a class="nav-link {{ request()->routeIs('admin.taxes.*') ? 'active' : '' }}" href="{{ route('admin.taxes.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-percent"></i></div>
                Taxes
            </a>
            <a class="nav-link {{ request()->routeIs('admin.roles.*') ? 'active' : '' }}" href="{{ route('admin.roles.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-user-shield"></i></div>
                Roles & Permissions
            </a>
            <a class="nav-link {{ request()->routeIs('admin.settings.*') ? 'active' : '' }}" href="{{ route('admin.settings.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-cog"></i></div>
                Settings
            </a>
            <a class="nav-link {{ request()->routeIs('admin.audit-logs.*') ? 'active' : '' }}" href="{{ route('admin.audit-logs.index') }}">
                <div class="sb-nav-link-icon"><i class="fas fa-history"></i></div>
                Audit Logs
            </a>
        </div>
    </div>
</nav>
