import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, ExternalLink } from 'lucide-react';

export function Resources() {
  const categories = [
    {
      title: "Biology (Botany & Zoology)",
      icon: DnaIcon,
      items: [
        { name: "NCERT Class 11 & 12 Biology", desc: "The Bible for NEET Biology. Direct questions are extracted from lines.", type: 'book' },
        { name: "MTG NCERT at your Fingertips", desc: "Excellent MCQ practice directly aligned with NCERT.", type: 'book' },
        { name: "Trueman's Elementary Biology", desc: "For deep conceptual clarity, but stick to NCERT syllabus boundaries.", type: 'book' }
      ]
    },
    {
      title: "Physics",
      icon: AtomIcon,
      items: [
        { name: "Concepts of Physics by H.C. Verma", desc: "Volume 1 & 2. Crucial for building basic concepts and logic.", type: 'book' },
        { name: "DC Pandey Objective Physics", desc: "Great for numerical practice geared specifically towards NEET.", type: 'book' },
        { name: "NCERT Physics Class 11 & 12", desc: "Read 'Points to Ponder' and back exercises thoroughly.", type: 'book' }
      ]
    },
    {
      title: "Chemistry",
      icon: MicroscopeIcon,
      items: [
        { name: "NCERT Chemistry", desc: "Inorganic chemistry must be memorized line-by-line from NCERT.", type: 'book' },
        { name: "Physical Chemistry by O.P. Tandon", desc: "Good for clearing physical chemistry numericals and concepts.", type: 'book' },
        { name: "Organic Chemistry by Morrison & Boyd", desc: "Reference only for deep understanding of reaction mechanisms.", type: 'book' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-serif text-[#5A5A40] mb-4">
          Recommended Material
        </h1>
        <p className="text-lg text-[#4A4A3A]/70 max-w-2xl">
          Curated list of standard books and resources for NEET preparation. Always prioritize NCERT textbooks above everything else.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[32px] p-8 border border-[#E4E3E0] shadow-sm flex flex-col"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-[#E4E3E0]/50 text-[#5A5A40] rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-serif text-[#5A5A40]">{cat.title}</h2>
              </div>
              
              <div className="space-y-4 flex-1">
                {cat.items.map((item, i) => (
                  <div key={i} className="group p-5 bg-[#F5F5F0]/50 rounded-2xl hover:bg-[#F5F5F0] border border-transparent hover:border-[#E4E3E0] transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-[#5A5A40] text-sm">{item.name}</h3>
                        <p className="text-xs text-[#4A4A3A]/70 mt-1.5 leading-relaxed">{item.desc}</p>
                      </div>
                      <BookOpen className="w-4 h-4 text-[#5A5A40]/30 group-hover:text-[#5A5A40] shrink-0 mt-0.5 ml-3 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Temporary inline icons to avoid extra imports up top
function DnaIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 22 8-20"/><path d="M16 2A6 6 0 0 0 8 2"/><path d="M8 22A6 6 0 0 0 16 22"/><path d="M12 4v16"/><path d="m8 10 8 4"/><path d="m16 10-8 4"/></svg>; }
function AtomIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function MicroscopeIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>; }
