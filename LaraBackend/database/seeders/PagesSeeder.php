<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PagesSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'about',
                'title' => 'About Us',
                'sort_order' => 1,
                'meta_title' => 'About Us',
                'meta_description' => 'Learn about our mission, vision, and what makes us different.',
                'content' => <<<'HTML'
<p>We're a modern e-commerce platform built to bring you quality products at fair prices, backed by a shopping experience that puts you first. From curated collections to reliable delivery, everything we do is designed around our customers.</p>

<h3>Our Mission</h3>
<p>To make quality products accessible to everyone through a seamless, transparent, and enjoyable online shopping experience.</p>

<h3>Our Vision</h3>
<p>To become the most trusted destination for online shopping, known for our commitment to quality, value, and customer happiness.</p>

<h3>Why Choose Us</h3>
<ul>
    <li><strong>Fast Delivery</strong> — Reliable shipping across the country with real-time tracking.</li>
    <li><strong>Secure Payments</strong> — Your transactions are protected with industry-grade encryption.</li>
    <li><strong>Easy Returns</strong> — Hassle-free returns and exchanges within 7 days of delivery.</li>
    <li><strong>24/7 Support</strong> — Our team is always here to help you with any questions.</li>
</ul>
HTML,
            ],
            [
                'slug' => 'privacy-policy',
                'title' => 'Privacy Policy',
                'sort_order' => 2,
                'meta_title' => 'Privacy Policy',
                'meta_description' => 'How we collect, use, and protect your personal information.',
                'content' => <<<'HTML'
<p>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.</p>

<h3>Information We Collect</h3>
<p>We collect information such as your name, email address, phone number, shipping address, and payment details when you create an account or place an order.</p>

<h3>How We Use Your Information</h3>
<p>Your information is used to process orders, provide customer support, improve our services, and communicate important updates or promotional offers.</p>

<h3>Data Security</h3>
<p>We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or misuse.</p>

<h3>Third-Party Services</h3>
<p>We may share information with trusted payment gateways and logistics partners solely to fulfill your orders and process payments.</p>

<h3>Your Rights</h3>
<p>You can update or delete your account information by contacting our support team. You may also opt out of marketing communications at any time.</p>
HTML,
            ],
            [
                'slug' => 'terms-conditions',
                'title' => 'Terms & Conditions',
                'sort_order' => 3,
                'meta_title' => 'Terms & Conditions',
                'meta_description' => 'Terms and conditions for using our ecommerce platform.',
                'content' => <<<'HTML'
<p>Welcome to our ecommerce platform. By accessing or using our website, you agree to the following terms and conditions.</p>

<h3>Use of Website</h3>
<p>You agree to use our website for lawful purposes only. Any misuse, fraudulent activity, or abuse of the platform is strictly prohibited.</p>

<h3>Orders & Payments</h3>
<p>All orders are subject to availability and confirmation. Prices are listed in INR and may include applicable taxes. Payments are processed securely through our payment partners.</p>

<h3>Shipping & Delivery</h3>
<p>We aim to deliver orders within the estimated timeframe. Delivery times may vary depending on location and external factors beyond our control.</p>

<h3>Returns & Refunds</h3>
<p>Products may be returned within the specified return window, subject to our return policy. Refunds are processed after the returned item is received and inspected.</p>

<h3>Changes to Terms</h3>
<p>We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance of the revised terms.</p>
HTML,
            ],
            [
                'slug' => 'faq',
                'title' => 'Frequently Asked Questions',
                'sort_order' => 4,
                'meta_title' => 'FAQ',
                'meta_description' => 'Answers to common questions about orders, payments, and returns.',
                'content' => <<<'HTML'
<h3>How do I place an order?</h3>
<p>Browse products, add items to your cart, and proceed to checkout. You can pay securely via Razorpay.</p>

<h3>What payment methods do you accept?</h3>
<p>We accept UPI, credit/debit cards, net banking, and wallets through our secure payment partner.</p>

<h3>How can I track my order?</h3>
<p>Go to My Orders and click on an order to see its current status and tracking information.</p>

<h3>What is your return policy?</h3>
<p>We offer a 7-day return policy for unused items in original packaging. Contact support to initiate a return.</p>

<h3>How do I contact customer support?</h3>
<p>Visit our Contact page or email us at support@example.com. We usually respond within 24 hours.</p>
HTML,
            ],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(
                ['slug' => $page['slug']],
                array_merge($page, ['status' => true])
            );
        }
    }
}
