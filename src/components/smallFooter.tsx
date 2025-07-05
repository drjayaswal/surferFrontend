export default function SmallFooter() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-20 w-full px-6 py-2 text-sm text-sky-700 bg-transparent flex items-center justify-between">
      <div className="flex items-center gap-2">
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/drjayaswal"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sky-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.486 2 12.012c0 4.424 2.865 8.176 6.839 9.504.5.092.682-.218.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.37-1.34-3.37-1.34-.454-1.156-1.11-1.464-1.11-1.464-.909-.621.069-.609.069-.609 1.004.071 1.532 1.032 1.532 1.032.893 1.532 2.341 1.09 2.91.833.092-.647.35-1.091.636-1.342-2.22-.255-4.555-1.113-4.555-4.954 0-1.094.39-1.987 1.029-2.686-.103-.254-.446-1.278.098-2.663 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.91-1.295 2.748-1.025 2.748-1.025.546 1.385.202 2.409.1 2.663.64.699 1.027 1.592 1.027 2.686 0 3.852-2.338 4.695-4.566 4.945.36.309.678.92.678 1.854 0 1.338-.012 2.418-.012 2.747 0 .268.18.58.688.481A10.015 10.015 0 0022 12.012C22 6.486 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a
          href="https://linkedin.com/in/drjayaswal"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sky-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.3c-1 0-1.7-.7-1.7-1.6s.7-1.7 1.7-1.7 1.6.8 1.6 1.7-.7 1.6-1.6 1.6zm13.5 11.3h-3v-5.5c0-1.3-.5-2.2-1.6-2.2-.9 0-1.3.6-1.5 1.2-.1.3-.1.8-.1 1.3v5.2h-3s.1-8.5 0-10h3v1.4c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1v6z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
