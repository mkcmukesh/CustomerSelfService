import React from "https://esm.sh/react@18.3.1";
import ReactDOM from "https://esm.sh/react-dom@18.3.1/client";

function PdfPixelPerfect(){
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#111827]">
      <main className="max-w-[1200px] mx-auto px-4 py-8 space-y-7">
        <section aria-label="Web Design templates Selection" className="bg-white rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,.09)] overflow-hidden">
          <div className="grid md:grid-cols-[1.15fr_1fr] items-center gap-8">
            <div className="aspect-[4/3] overflow-hidden">
              <img src="https://picsum.photos/seed/hero/1200/900" alt="Abstract paint texture" className="w-full h-full object-cover" />
            </div>
            <div className="px-8 py-10 md:py-10 md:pr-8">
              <div className="flex items-center gap-3">
                <h1 className="text-[48px] leading-[1.05] md:text-[48px] font-black -tracking-[0.02em] mb-3">
                  Web Design templates<br/>Selection
                </h1>
                <span className="ml-auto grid place-items-center w-7 h-7 rounded-full" aria-label="more options">
                  <svg className="w-[22px] h-[22px] opacity-65" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </span>
              </div>
              <p className="text-[18px] text-[#6b7280] max-w-[50ch]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow">
                  <img src="https://picsum.photos/seed/ronald/120/120" alt="Ronald Richards" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-extrabold">Ronald Richards</div>
                  <div className="text-sm text-[#6b7280]">Marketing Coordinator</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Jerome Bell Profile" className="bg-white rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,.09)] overflow-hidden">
          <header className="flex items-center gap-3 px-4 pt-4 pb-2">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
              <img src="https://picsum.photos/seed/jerome/150/150" alt="Jerome Bell" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold">Jerome Bell</div>
              <div className="text-sm text-[#6b7280]">Photographer</div>
            </div>
            <button
              className="inline-flex items-center gap-2 border border-[#111827] rounded-full px-4 py-2 uppercase text-[12px] font-extrabold tracking-wide shadow-[0_2px_0_rgba(0,0,0,.12)] active:translate-y-px"
              onClick={() => alert('PROFILE clicked — connect this to your route or modal.')}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
                <path d="M20 22a8 8 0 0 0-16 0" />
              </svg>
              Profile
            </button>
          </header>

          <div className="p-3 grid grid-cols-2 gap-2">
            <figure className="rounded-[12px] overflow-hidden aspect-[4/3]">
              <img src="https://picsum.photos/seed/brushes/800/600" alt="Brushes" className="w-full h-full object-cover" />
            </figure>
            <figure className="rounded-[12px] overflow-hidden aspect-[4/3]">
              <img src="https://picsum.photos/seed/cups/800/600" alt="Cups" className="w-full h-full object-cover" />
            </figure>
            <figure className="rounded-[12px] overflow-hidden aspect-[4/3]">
              <img src="https://picsum.photos/seed/paint/800/600" alt="Paint" className="w-full h-full object-cover" />
            </figure>
            <figure className="rounded-[12px] overflow-hidden aspect-[4/3]">
              <img src="https://picsum.photos/seed/palette/800/600" alt="Palette" className="w-full h-full object-cover" />
            </figure>
          </div>

          <div className="px-4 pb-6 space-y-4">
            <div>
              <div className="text-sm text-[#6b7280] mb-1">Photographs</div>
              <h2 className="text-[36px] font-black -tracking-[0.01em]">Lorem ipsun</h2>
              <p className="text-[#6b7280] max-w-[60ch]">Minim dolor in amet nulla laboris enim dolore consequatt...</p>
            </div>
            <div>
              <div className="text-sm text-[#6b7280] mb-1">Photographs</div>
              <h2 className="text-[36px] font-black -tracking-[0.01em]">Lorem ipsun</h2>
              <p className="text-[#6b7280] max-w-[60ch]">Minim dolor in amet nulla laboris enim dolore consequatt...</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<PdfPixelPerfect />);