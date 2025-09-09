export default function Footer() {
  return (
    <footer
      className="bg-[#0a0215] text-gray-300 w-full mt-16"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      {/* Top Section */}
      <div className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            CODEXPERT
          </h2>
          <p className="text-gray-400 text-sm">
            AI-powered platform to help software teams manage, collaborate, and
            deliver faster.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/" className="hover:text-pink-500 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a
                href="/code-comments"
                className="hover:text-pink-500 transition-colors"
              >
                Code Comments
              </a>
            </li>
            <li>
              <a
                href="/improve-code"
                className="hover:text-pink-500 transition-colors"
              >
                Improve Code
              </a>
            </li>
            <li>
              <a
                href="/bug-finder"
                className="hover:text-pink-500 transition-colors"
              >
                Bug Finder
              </a>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold mb-4">Contact & Social</h3>
          <ul className="flex flex-col gap-2">
            <li>
              Email:{" "}
              <a
                href="mailto:info@codexpert.com"
                className="hover:text-pink-500 transition-colors"
              >
                info@codexpert.com
              </a>
            </li>
            <li>
              Twitter:{" "}
              <a
                href="https://twitter.com/codexpert"
                className="hover:text-pink-500 transition-colors"
              >
                @CodeXpert
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a
                href="https://linkedin.com/company/codexpert"
                className="hover:text-pink-500 transition-colors"
              >
                CodeXpert
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-700"></div>

      {/* Bottom Section */}
      <div className="w-full text-center text-gray-500 text-sm py-6">
        &copy; {new Date().getFullYear()} CodeXpert. All rights reserved.
      </div>
    </footer>
  );
}
