
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="siteFooter">
            <div className="footerWrapper">
                <section id="footerAbout" className="footerSection">
                    <h3>Admin Dashboard</h3>
                    <p>Manage customers, orders, tickets, and integrations from one place.</p>
                </section>

                <nav id="footerNav" className="footerSection" aria-label="Footer navigation">
                    <h4>Quick links</h4>
                    <ul className="footerLinks">
                        <li><Link href="/dashboard">Dashboard</Link></li>
                        <li><Link href="/customers">Customers</Link></li>
                        <li><Link href="/orders">Orders</Link></li>
                        <li><Link href="/tickets">Tickets</Link></li>
                        <li><Link href="/integrations">Integrations</Link></li>
                        <li><Link href="/settings">Settings</Link></li>
                    </ul>
                </nav>

                <section id="footerSocial" className="footerSection">
                    <h4>Contact</h4>
                    <address className="footerContact">
                        <a href="mailto:support@yourcompany.com">artourbouloudis@gmail.com</a>
                    </address>

                    <div className="socialLinks" aria-label="Social links">
                        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </div>
            <div className="footerBottom">
                <small>© {new Date().getFullYear()} Your Company. All rights reserved.</small>
            </div>
                </section>
            </div>


        </footer>
    )
}