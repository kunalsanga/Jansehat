import React from 'react';

function AIAnalysisResult({ analysis, timestamp }) {
  // Parse the AI analysis text into structured sections
  const parseAnalysis = (text) => {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check for section headers
      if (line.startsWith('**') && line.endsWith('**')) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection);
        }

        // Start new section
        const title = line.replace(/\*\*/g, '').trim();
        currentSection = {
          title,
          content: [],
          type: getSectionType(title)
        };
      } else if (line && currentSection) {
        // Add content to current section with enhanced formatting
        currentSection.content.push(enhanceTextFormatting(line));
      }
    }

    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const enhanceTextFormatting = (text) => {
    // Make bold text more prominent
    let enhancedText = text
      // Bold text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      // Italic text formatting
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      // Highlight severity levels
      .replace(/\b(High|HIGH|Urgent|URGENT|Emergency|EMERGENCY|Critical|CRITICAL)\b/g, '<span class="font-bold text-red-600 px-1 rounded">$1</span>')
      .replace(/\b(Medium|MEDIUM|Moderate|MODERATE)\b/g, '<span class="font-bold text-yellow-600 px-1 rounded">$1</span>')
      .replace(/\b(Low|LOW|Mild|MILD|Minor|MINOR)\b/g, '<span class="font-bold text-green-600 px-1 rounded">$1</span>')
      // Highlight important medical terms
      .replace(/\b(immediately|urgent|emergency|severe|critical|dangerous|life-threatening)\b/gi, '<span class="font-bold text-red-700">$1</span>')
      .replace(/\b(consult|doctor|physician|healthcare|medical|hospital|clinic)\b/gi, '<span class="font-semibold text-blue-700">$1</span>')
      .replace(/\b(medication|medicine|drug|prescription|treatment|therapy)\b/gi, '<span class="font-semibold text-purple-700">$1</span>')
      // Highlight numbers and percentages
      .replace(/\b(\d+%|\d+\.\d+%|\d+\/\d+)\b/g, '<span class="font-bold text-indigo-600">$1</span>')
      // Highlight time references
      .replace(/\b(\d+\s*(hours?|days?|weeks?|months?|years?))\b/gi, '<span class="font-semibold text-orange-600">$1</span>')
      // Highlight symptoms and conditions
      .replace(/\b(fever|pain|ache|swelling|rash|nausea|vomiting|diarrhea|headache|dizziness|fatigue|cough|sore throat|shortness of breath)\b/gi, '<span class="font-semibold text-gray-800 bg-gray-50 px-1 rounded">$1</span>')
      // Highlight important action words
      .replace(/\b(avoid|stop|continue|increase|decrease|monitor|check|measure|rest|exercise|drink|eat|take)\b/gi, '<span class="font-semibold text-green-700">$1</span>');

    return enhancedText;
  };

  const getSectionType = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('possible conditions') || titleLower.includes('condition')) {
      return 'conditions';
    } else if (titleLower.includes('urgency') || titleLower.includes('level')) {
      return 'urgency';
    } else if (titleLower.includes('recommended') || titleLower.includes('action')) {
      return 'actions';
    } else if (titleLower.includes('immediate') || titleLower.includes('emergency')) {
      return 'emergency';
    } else if (titleLower.includes('general') || titleLower.includes('advice')) {
      return 'advice';
    } else if (titleLower.includes('disclaimer') || titleLower.includes('important')) {
      return 'disclaimer';
    }
    return 'default';
  };

  const sections = parseAnalysis(analysis);

  // Render the content as a clean, continuous text stream
  return (
    <div className="space-y-6 text-base text-gray-800 leading-relaxed font-normal">
      {sections.map((section, index) => (
        <div key={index} className="space-y-2">
          {/* Section Title - formatted like a subheader */}
          <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider opacity-80 mb-1">
            {section.title}
          </h3>

          {/* Section Content */}
          <div className="space-y-2">
            {section.content.map((line, lineIndex) => (
              <div key={lineIndex} className="pl-0">
                {line.startsWith('-') || line.startsWith('•') ? (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1.5 text-[6px]">●</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: line.replace(/^[-•]\s*/, '')
                      }}
                    />
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Disclaimer - Subtle footer */}
      <div className="pt-4 mt-4 border-t border-gray-100 text-xs text-gray-400 italic">
        ⚠️ Preliminary AI analysis only. Always consult a healthcare professional.
      </div>
    </div>
  );
}

export default AIAnalysisResult;
