import { useState, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Network, Users, Store, Server, MousePointer2, ShieldAlert } from 'lucide-react';

export default function FraudNetwork() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeCase, setActiveCase] = useState(1);

  // Responsive canvas sizing
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }, [activeCase]);

  // --- THE 5 THESIS CASE STUDIES ---
  const caseStudies = {
    1: {
      title: "Case Study 1: Agent Reversal Scam Ring",
      description: "Demonstrates a directed cycle followed by a fan-in pattern. Transactions are layered and obfuscated before hitting a single agent for an ostensibly valid reversal demand.",
      data: {
        nodes: [
          { id: 'SCAMMER_1', group: 'scammer', name: 'Mastermind', val: 20 },
          { id: 'MULE_A', group: 'mule', name: 'Layering Mule A', val: 15 },
          { id: 'MULE_B', group: 'mule', name: 'Layering Mule B', val: 15 },
          { id: 'MULE_C', group: 'mule', name: 'Layering Mule C', val: 15 },
          { id: 'AGENT_99', group: 'agent', name: 'Target Reversal Agent', val: 25 },
        ],
        links: [
          { source: 'SCAMMER_1', target: 'MULE_A', risk: 'high' },
          { source: 'MULE_A', target: 'MULE_B', risk: 'high' },
          { source: 'MULE_B', target: 'MULE_C', risk: 'medium' },
          { source: 'MULE_C', target: 'SCAMMER_1', risk: 'high' }, // The Cycle
          { source: 'MULE_A', target: 'AGENT_99', risk: 'high' },  // Fan-in
          { source: 'MULE_B', target: 'AGENT_99', risk: 'high' },  // Fan-in
          { source: 'MULE_C', target: 'AGENT_99', risk: 'high' },  // Fan-in
        ]
      }
    },
    2: {
      title: "Case Study 2: Mulot SIM Swap Mules",
      description: "Demonstrates star-shaped subgraphs. Multiple mule accounts appear normal individually but are consistently linked to a central fraudulent organization utilizing stolen national IDs.",
      data: {
        nodes: [
          { id: 'MULOT_ORG', group: 'scammer', name: 'Central Syndicate', val: 30 },
          { id: 'MULE_1', group: 'mule', name: 'Stolen ID 1', val: 10 },
          { id: 'MULE_2', group: 'mule', name: 'Stolen ID 2', val: 10 },
          { id: 'MULE_3', group: 'mule', name: 'Stolen ID 3', val: 10 },
          { id: 'MULE_4', group: 'mule', name: 'Stolen ID 4', val: 10 },
          { id: 'MULE_5', group: 'mule', name: 'Stolen ID 5', val: 10 },
        ],
        links: [
          { source: 'MULOT_ORG', target: 'MULE_1', risk: 'high' },
          { source: 'MULOT_ORG', target: 'MULE_2', risk: 'high' },
          { source: 'MULOT_ORG', target: 'MULE_3', risk: 'high' },
          { source: 'MULOT_ORG', target: 'MULE_4', risk: 'high' },
          { source: 'MULOT_ORG', target: 'MULE_5', risk: 'high' },
        ]
      }
    },
    3: {
      title: "Case Study 3: Identity to Fast Cash-out Explosion",
      description: "Demonstrates an explosive star topology of consecutive transactions. A hijacked account rapidly distributes funds to 3-7 accounts with immediate withdrawal.",
      data: {
        nodes: [
          { id: 'HIJACKED_ACC', group: 'victim', name: 'Compromised User', val: 25 },
          { id: 'DROP_1', group: 'mule', name: 'Drop Account 1', val: 10 },
          { id: 'DROP_2', group: 'mule', name: 'Drop Account 2', val: 10 },
          { id: 'DROP_3', group: 'mule', name: 'Drop Account 3', val: 10 },
          { id: 'AGENT_X', group: 'agent', name: 'Cash Out Agent', val: 20 },
        ],
        links: [
          { source: 'HIJACKED_ACC', target: 'DROP_1', risk: 'high' },
          { source: 'HIJACKED_ACC', target: 'DROP_2', risk: 'high' },
          { source: 'HIJACKED_ACC', target: 'DROP_3', risk: 'high' },
          { source: 'DROP_1', target: 'AGENT_X', risk: 'high' }, // Instant withdrawal
          { source: 'DROP_2', target: 'AGENT_X', risk: 'high' }, // Instant withdrawal
          { source: 'DROP_3', target: 'AGENT_X', risk: 'high' }, // Instant withdrawal
        ]
      }
    },
    4: {
      title: "Case Study 4: Synecdoche Circles (Fuliza/M-Shwari)",
      description: "Demonstrates homophily and covert groups. Synthetic identities collaborate and interconnect to artificially boost credit limits before a coordinated default.",
      data: {
        nodes: [
          { id: 'LENDER_API', group: 'till', name: 'Fuliza/M-Shwari API', val: 30 },
          { id: 'SYN_1', group: 'mule', name: 'Synthetic ID 1', val: 15 },
          { id: 'SYN_2', group: 'mule', name: 'Synthetic ID 2', val: 15 },
          { id: 'SYN_3', group: 'mule', name: 'Synthetic ID 3', val: 15 },
          { id: 'SYN_4', group: 'mule', name: 'Synthetic ID 4', val: 15 },
        ],
        links: [
          // Interconnected borrowing/sending to build limit
          { source: 'SYN_1', target: 'SYN_2', risk: 'medium' },
          { source: 'SYN_2', target: 'SYN_3', risk: 'medium' },
          { source: 'SYN_3', target: 'SYN_1', risk: 'medium' },
          { source: 'SYN_4', target: 'SYN_1', risk: 'medium' },
          { source: 'SYN_4', target: 'SYN_2', risk: 'medium' },
          // Coordinated Default
          { source: 'LENDER_API', target: 'SYN_1', risk: 'high' },
          { source: 'LENDER_API', target: 'SYN_2', risk: 'high' },
          { source: 'LENDER_API', target: 'SYN_3', risk: 'high' },
          { source: 'LENDER_API', target: 'SYN_4', risk: 'high' },
        ]
      }
    },
    5: {
      title: "Case Study 5: Fraudulent Business Till Inflation",
      description: "Demonstrates unusual densification of an account-pair. Cyclic, bidirectional transactions between a user and a business till to launder money or inflate credit scores.",
      data: {
        nodes: [
          { id: 'BIZ_TILL', group: 'till', name: 'Business Till (Lipa na M-Pesa)', val: 35 },
          { id: 'LAUNDER_1', group: 'scammer', name: 'Wash Account 1', val: 20 },
          { id: 'LAUNDER_2', group: 'scammer', name: 'Wash Account 2', val: 20 },
          { id: 'NORMAL_USER', group: 'victim', name: 'Legitimate Customer', val: 10 },
        ],
        links: [
          // Dense, cyclic inflation loops
          { source: 'LAUNDER_1', target: 'BIZ_TILL', risk: 'high' },
          { source: 'BIZ_TILL', target: 'LAUNDER_1', risk: 'high' },
          { source: 'LAUNDER_2', target: 'BIZ_TILL', risk: 'high' },
          { source: 'BIZ_TILL', target: 'LAUNDER_2', risk: 'high' },
          // Normal traffic noise
          { source: 'NORMAL_USER', target: 'BIZ_TILL', risk: 'low' },
        ]
      }
    }
  };

  const currentGraph = caseStudies[activeCase];

  // Canvas Drawing logic for custom node colors
  const drawNode = (node, ctx, globalScale) => {
    const label = node.id;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    
    // Node colors based on thesis entity groups
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 
      node.group === 'scammer' ? '#ef4444' : // Red
      node.group === 'mule' ? '#f59e0b' :    // Orange
      node.group === 'agent' ? '#8b5cf6' :   // Purple
      node.group === 'till' ? '#10b981' :    // Green
      '#3b82f6';                             // Blue (Victims/Normal)
    ctx.fill();
    
    // Node Label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(label, node.x, node.y + (node.val / 2) + 6);
  };

  // Link colors based on risk
  const getLinkColor = (link) => {
    if (link.risk === 'high') return '#ef4444'; // Red
    if (link.risk === 'medium') return '#f59e0b'; // Yellow
    return '#9ca3af'; // Gray for low risk/normal
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Network Visualization</h1>
          <p className="text-gray-500">Stacked Hybrid Topology Analysis</p>
        </div>
        
        {/* THESIS CASE STUDY SELECTOR */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(num => (
            <button 
              key={num}
              onClick={() => { setSelectedNode(null); setActiveCase(num); }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                activeCase === num 
                ? 'bg-brandPrimary text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Case {num}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC SCENARIO DESCRIPTION */}
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-t-xl flex items-start gap-3">
        <ShieldAlert className="text-brandPrimary shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-bold text-gray-900 text-sm">{currentGraph.title}</h3>
          <p className="text-sm text-gray-700 mt-1">{currentGraph.description}</p>
        </div>
      </div>

      {/* TOP LEGEND */}
      <div className="bg-white p-3 border-x border-gray-200 flex items-center gap-6 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Scammers</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Mules / Synthetic IDs</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Agents</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Business Tills / APIs</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Normal Users</div>
      </div>

      <div className="flex-1 flex gap-6 bg-white p-6 rounded-b-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* GRAPH CANVAS */}
        <div 
          ref={containerRef} 
          className="flex-1 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-grab active:cursor-grabbing overflow-hidden relative"
        >
          {dimensions.width > 0 && (
            <ForceGraph2D
              width={dimensions.width}
              height={dimensions.height}
              graphData={currentGraph.data}
              nodeCanvasObject={drawNode}
              linkColor={getLinkColor}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={1}
              linkWidth={link => link.risk === 'high' ? 2 : 1}
              onNodeClick={node => setSelectedNode(node)}
              cooldownTicks={100}
            />
          )}
        </div>

        {/* RIGHT SIDEBAR: Stats & Details */}
        <div className="w-80 flex flex-col gap-6">
          
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex-1">
            <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4 flex items-center gap-2">
              <MousePointer2 size={18} className="text-brandPrimary" /> 
              Node Intelligence
            </h3>
            
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Entity ID</p>
                  <p className="font-mono text-gray-900 font-medium bg-white px-3 py-2 border rounded-md">{selectedNode.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Graph Classification</p>
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold text-gray-700 capitalize">
                    {selectedNode.group.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Role Description</p>
                  <p className="text-sm text-gray-700">{selectedNode.name}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Network size={40} className="mb-3 opacity-50" />
                <p className="text-sm text-center px-4">Click a node to inspect its graph embeddings.</p>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">Topology Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm text-gray-600"><Network size={16} /> Total Nodes</span>
                <span className="font-bold text-gray-900">{currentGraph.data.nodes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm text-gray-600"><Network size={16} /> Edges (Transactions)</span>
                <span className="font-bold text-gray-900">{currentGraph.data.links.length}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}