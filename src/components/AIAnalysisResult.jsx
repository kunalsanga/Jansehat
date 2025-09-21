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
      .replace(/\b(High|HIGH|Urgent|URGENT|Emergency|EMERGENCY|Critical|CRITICAL)\b/g, '<span class="font-bold text-red-600 bg-red-50 px-1 rounded">$1</span>')
      .replace(/\b(Medium|MEDIUM|Moderate|MODERATE)\b/g, '<span class="font-bold text-yellow-600 bg-yellow-50 px-1 rounded">$1</span>')
      .replace(/\b(Low|LOW|Mild|MILD|Minor|MINOR)\b/g, '<span class="font-bold text-green-600 bg-green-50 px-1 rounded">$1</span>')
      // Highlight important medical terms
      .replace(/\b(immediately|urgent|emergency|severe|critical|dangerous|life-threatening)\b/gi, '<span class="font-bold text-red-700">$1</span>')
      .replace(/\b(consult|doctor|physician|healthcare|medical|hospital|clinic)\b/gi, '<span class="font-semibold text-blue-700">$1</span>')
      .replace(/\b(medication|medicine|drug|prescription|treatment|therapy)\b/gi, '<span class="font-semibold text-purple-700">$1</span>')
      // Highlight numbers and percentages
      .replace(/\b(\d+%|\d+\.\d+%|\d+\/\d+)\b/g, '<span class="font-bold text-indigo-600">$1</span>')
      // Highlight time references
      .replace(/\b(\d+\s*(hours?|days?|weeks?|months?|years?))\b/gi, '<span class="font-semibold text-orange-600">$1</span>')
      // Highlight symptoms and conditions
      .replace(/\b(fever|pain|ache|swelling|rash|nausea|vomiting|diarrhea|headache|dizziness|fatigue|cough|sore throat|shortness of breath)\b/gi, '<span class="font-semibold text-gray-800 bg-gray-100 px-1 rounded">$1</span>')
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

  const getSectionIcon = (type) => {
    switch (type) {
      case 'conditions': return '🩺';
      case 'urgency': return '⚠️';
      case 'actions': return '📋';
      case 'emergency': return '🚨';
      case 'advice': return '💡';
      case 'disclaimer': return 'ℹ️';
      default: return '📄';
    }
  };

  const getSectionColor = (type) => {
    switch (type) {
      case 'conditions': return 'blue';
      case 'urgency': return 'yellow';
      case 'actions': return 'green';
      case 'emergency': return 'red';
      case 'advice': return 'purple';
      case 'disclaimer': return 'gray';
      default: return 'blue';
    }
  };

  const getUrgencyColor = (content) => {
    const text = content.join(' ').toLowerCase();
    if (text.includes('high') || text.includes('urgent') || text.includes('emergency')) {
      return 'red';
    } else if (text.includes('medium') || text.includes('moderate')) {
      return 'yellow';
    } else if (text.includes('low') || text.includes('mild')) {
      return 'green';
    }
    return 'blue';
  };

  const sections = parseAnalysis(analysis);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-lg">
            🤖
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Health Analysis</h3>
            <p className="text-sm text-gray-600">Preliminary assessment based on your symptoms</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
          {new Date(timestamp).toLocaleString()}
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => {
          const color = section.type === 'urgency' ? getUrgencyColor(section.content) : getSectionColor(section.type);
          const icon = getSectionIcon(section.type);
          
          return (
            <div key={index} className={`rounded-lg border-l-4 ${
              color === 'red' ? 'border-red-500 bg-red-50' :
              color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
              color === 'green' ? 'border-green-500 bg-green-50' :
              color === 'blue' ? 'border-blue-500 bg-blue-50' :
              color === 'purple' ? 'border-purple-500 bg-purple-50' :
              'border-gray-500 bg-gray-50'
            }`}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full grid place-items-center text-lg ${
                    color === 'red' ? 'bg-red-100 text-red-600' :
                    color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    color === 'green' ? 'bg-green-100 text-green-600' :
                    color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {icon}
                  </div>
                  <h4 className={`font-bold text-lg ${
                    color === 'red' ? 'text-red-900' :
                    color === 'yellow' ? 'text-yellow-900' :
                    color === 'green' ? 'text-green-900' :
                    color === 'blue' ? 'text-blue-900' :
                    color === 'purple' ? 'text-purple-900' :
                    'text-gray-900'
                  }`}>
                    {section.title}
                  </h4>
                </div>
                
                <div className={`space-y-3 ${
                  color === 'red' ? 'text-red-800' :
                  color === 'yellow' ? 'text-yellow-800' :
                  color === 'green' ? 'text-green-800' :
                  color === 'blue' ? 'text-blue-800' :
                  color === 'purple' ? 'text-purple-800' :
                  'text-gray-800'
                }`}>
                  {section.content.map((line, lineIndex) => (
                    <div key={lineIndex} className="flex items-start gap-2">
                      {line.startsWith('-') || line.startsWith('•') ? (
                        <>
                          <span className="text-xs mt-1.5 text-gray-500">•</span>
                          <div 
                            className="text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                              __html: line.replace(/^[-•]\s*/, '') 
                            }}
                          />
                        </>
                      ) : (
                        <div 
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: line }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 grid place-items-center text-sm flex-shrink-0 mt-0.5">
            ⚠️
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-2">Important Medical Disclaimer</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              This AI analysis is for preliminary guidance only and should not replace professional medical diagnosis or treatment. 
              Always consult with qualified healthcare professionals for accurate diagnosis and treatment. 
              Seek immediate medical care for severe or worsening symptoms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAnalysisResult;
