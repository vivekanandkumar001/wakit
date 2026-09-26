import React, { useState, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { COUNTRIES, type Country } from '../data/countries';
import { AdBanner } from '../components/AdBanner';
import { SEOHead, type FAQItem } from '../components/SEOHead';
import { ToolSeoContent } from '../components/ToolSeoContent';
import { FAQAccordion } from '../components/FAQAccordion';
import { 
  Send, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  MessageSquare, 
  Sparkles, 
  PhoneCall, 
  ChevronDown,
  Info,
  Truck,
  ShoppingBag,
  UserCheck
} from 'lucide-react';

const directMessageFaqs: FAQItem[] = [
  {
    question: 'How to send a WhatsApp message without saving the contact number?',
    answer: 'Select your target country code from the dropdown above, type the phone number, optionally write your message text, and click "Open Chat Now". WhatsApp will immediately launch a direct chat window without saving the number to your contacts.',
  },
  {
    question: 'Is using WhatsApp Direct Message legal and official?',
    answer: 'Yes! WaKit uses WhatsApp\'s official universal deep-link format (`https://wa.me/<number>?text=<message>`). It is 100% compliant with WhatsApp terms of service.',
  },
  {
    question: 'Can I use this for international WhatsApp numbers?',
    answer: 'Absolutely! Our tool supports over 200 country dial codes (India +91, Kenya +254, Nigeria +234, USA +1, UK +44, UAE +971, etc.) with instant search filtering.',
  },
  {
    question: 'Does WaKit save or store the phone numbers I enter?',
    answer: 'Never! Your entered phone numbers and message content are processed entirely client-side inside your web browser. No logs or contact details are saved to any server.',
  },
  {
    question: 'Does this work on mobile phones and desktop computers?',
    answer: 'Yes! Clicking "Open Chat Now" seamlessly opens the WhatsApp mobile application on iOS and Android, or launches WhatsApp Web / Desktop on PC and Mac.',
  },
];

export const DirectMessagePage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const templates = [
    "Hello! Inquiring about your listing.",
    "Hi there, sharing my current location.",
    "Hey! Are you available to chat?",
    "Requesting details for scheduled meeting.",
    "Sending over the documents for review."
  ];

  const filteredCountries = useMemo(() => {
    const query = countrySearch.toLowerCase().trim();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.dialCode.includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [countrySearch]);

  const cleanPhone = useMemo(() => {
    return phoneNumber.replace(/\D/g, '');
  }, [phoneNumber]);

  const fullE164Number = useMemo(() => {
    const rawDial = selectedCountry.dialCode.replace('+', '');
    return `${rawDial}${cleanPhone}`;
  }, [selectedCountry, cleanPhone]);

  const waUrl = useMemo(() => {
    if (!cleanPhone) return '';
    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${fullE164Number}${encodedText ? `?text=${encodedText}` : ''}`;
  }, [cleanPhone, fullE164Number, message]);

  const isValidNumber = cleanPhone.length >= 6;

  const handleCopyLink = () => {
    if (!waUrl) return;
    navigator.clipboard.writeText(waUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChat = () => {
    if (!waUrl) return;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SEOHead
        title="Send WhatsApp Message Without Saving Number – Direct Chat | WhatsSwift"
        description="Chat on WhatsApp without saving numbers. Enter any phone number, add a message and open instantly via wa.me. Free, private, no signup needed."
        canonicalPath="/direct-chat-without-saving-number"
        keywords="send whatsapp message without saving number, whatsapp direct chat, wa.me link generator, chat without saving contact"
        faqs={directMessageFaqs}
        howToName="How to send a WhatsApp message without saving the number"
        howToSteps={[
          { name: 'Enter country code and number', text: 'Select the country dial code and type the phone number. It is formatted to E.164 automatically, entirely in your browser.' },
          { name: 'Add an optional message', text: 'Type a pre-filled message or pick a quick template so the chat opens with your text ready to send.' },
          { name: 'Open chat now', text: 'Click "Open Chat Now" to launch the official wa.me link in WhatsApp mobile, Web, or Desktop — no contact saved.' },
        ]}
      />

      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Send className="w-3.5 h-3.5" />
          <span>Click-to-Chat • Zero Contact Saving Required</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Send WhatsApp Message Without Saving Number
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Start a direct WhatsApp conversation instantly with any phone number without cluttering your address book.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-500" />
            <span>Enter Contact Details</span>
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Country & Phone Number
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative sm:w-48 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-12 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium flex items-center justify-between gap-2 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="font-mono font-semibold">{selectedCountry.dialCode}</span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-14 left-0 z-50 w-72 max-h-64 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 space-y-2">
                    <div className="relative sticky top-0 bg-white dark:bg-slate-900 pt-1 pb-2">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search country or code..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-0.5">
                      {filteredCountries.map((country) => (
                        <button
                          key={`${country.code}-${country.dialCode}`}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsDropdownOpen(false);
                            setCountrySearch('');
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            selectedCountry.code === country.code
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span className="truncate">{country.name}</span>
                          </span>
                          <span className="font-mono font-semibold text-slate-400">{country.dialCode}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative flex-1">
                <input
                  type="tel"
                  placeholder={selectedCountry.placeholder}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-medium text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>Standard E.164 Format:</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                +{fullE164Number}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <label>Message Text (Optional)</label>
              <span className="text-[11px] font-normal text-slate-400 font-mono">
                {message.length} chars
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Type optional message to pre-fill in WhatsApp..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Quick Message Templates</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(tmpl)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 font-medium transition-colors text-left"
                >
                  "{tmpl.substring(0, 24)}..."
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleOpenChat}
              disabled={!isValidNumber}
              className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Chat Now</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              disabled={!isValidNumber}
              className="py-3.5 px-5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR Code Container (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 flex flex-col items-center justify-between text-center space-y-6">
          <div className="space-y-1 w-full">
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              <QrCode className="w-4 h-4" />
              <span>Instant QR Code</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Scan to Start Chat
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Point phone camera to trigger WhatsApp link instantly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            {isValidNumber ? (
              <QRCodeCanvas
                value={waUrl}
                size={180}
                level="M"
                includeMargin={true}
              />
            ) : (
              <div className="w-[180px] h-[180px] rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs">Enter valid phone number to view QR code</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2 text-left w-full">
            <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              This link uses WhatsApp's official <code>wa.me</code> scheme. Compatible with WhatsApp mobile apps and WhatsApp Web.
            </span>
          </div>
        </div>
      </div>

      {/* Programmatic SEO Use-Case Cards */}
      <section className="space-y-6 my-10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">
          Popular Everyday Use Cases for Direct Messaging
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Delivery & Logistics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Send instant GPS location pins or delivery update notes to riders without filling your phone contact book with one-time numbers.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Marketplace Sellers (OLX/Jiji)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Inquire about classified item listings, negotiate prices, or verify seller details quickly without saving temporary contacts.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Business Leads & Inquiries</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Message prospective clients or vendor contacts directly from your desktop browser or mobile phone with zero hassle.
            </p>
          </div>
        </div>
      </section>

      {/* SEO How-To + WASM explainer */}
      <ToolSeoContent
        toolName="Direct Chat Without Saving Number"
        intro="Message any WhatsApp number without cluttering your contacts — official wa.me links, built locally in your browser, in three steps."
        steps={[
          { name: 'Enter Country Code & Number', text: 'Select the country dial code, type the number, and watch it format to E.164 automatically — all client-side.' },
          { name: 'Add an Optional Message', text: 'Type your text or tap a quick template so the conversation opens pre-filled and ready to send.' },
          { name: 'Open Chat Instantly', text: 'Hit "Open Chat Now" to launch the official wa.me link in WhatsApp. No contact saved, nothing stored.' },
        ]}
      />

      {/* Programmatic FAQ Section */}
      <FAQAccordion items={directMessageFaqs} title="WhatsApp Direct Message FAQ" />

      <AdBanner type="leaderboard" />
    </div>
  );
};
