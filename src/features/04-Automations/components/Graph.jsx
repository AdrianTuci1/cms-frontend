import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FaRobot, FaUser, FaMicrophone, FaChartLine, FaBrain, FaComments } from 'react-icons/fa';
import styles from '../styles/Graph.module.css';

// Custom Node Components
const AgentNode = ({ data }) => (
  <div className={`${styles.customNode} ${styles.agentNode}`}>
    <Handle
      type="source"
      position={Position.Right}
      style={{ background: '#3b82f6' }}
    />
    <Handle
      type="target"
      position={Position.Left}
      style={{ background: '#3b82f6' }}
    />
    <div className={styles.nodeIcon}>
      <FaRobot />
    </div>
    <span className={styles.nodeLabel}>Agent AI</span>
    <div className={styles.nodeStatus}>
      <span className={styles.statusDot}></span>
      Activ
    </div>
  </div>
);

const OperatorNode = ({ data }) => (
  <div className={`${styles.customNode} ${styles.operatorNode}`}>
    <Handle
      type="target"
      position={Position.Left}
      style={{ background: '#10b981' }}
    />
    <Handle
      type="source"
      position={Position.Right}
      style={{ background: '#10b981' }}
    />
    <div className={styles.nodeIcon}>
      <FaUser />
    </div>
    <span className={styles.nodeLabel}>Operator</span>
    <div className={styles.nodeStatus}>
      <span className={styles.statusDot}></span>
      Disponibil
    </div>
  </div>
);

const ActionNode = ({ data }) => {
  const IconComponent = data.icon;
  
  return (
    <div className={`${styles.customNode} ${styles.actionNode}`}>
      <div className={styles.nodeIcon}>
        <IconComponent />
      </div>
      <span className={styles.nodeLabel}>{data.label}</span>
      <span className={styles.nodeDescription}>{data.description}</span>
    </div>
  );
};

const nodeTypes = {
  agent: AgentNode,
  operator: OperatorNode,
  action: ActionNode,
};

const Graph = () => {
  // Agent actions that can be activated
  const agentActions = [
    { 
      id: 'elevenlabs', 
      label: 'ElevenLabs', 
      icon: FaMicrophone, 
      description: 'Sinteză vocală',
      type: 'ai'
    },
    { 
      id: 'analyze', 
      label: 'Analizează Rezervări', 
      icon: FaChartLine, 
      description: 'Procesare date',
      type: 'ai'
    },
    { 
      id: 'ai', 
      label: 'AI Processing', 
      icon: FaBrain, 
      description: 'Procesare inteligentă',
      type: 'ai'
    },
    { 
      id: 'chat', 
      label: 'Chat Support', 
      icon: FaComments, 
      description: 'Suport conversațional',
      type: 'ai'
    }
  ];

  // Create nodes
  const initialNodes = useMemo(() => {
    const nodes = [
      // Main Agent Node
      {
        id: 'agent',
        type: 'agent',
        position: { x: 300, y: 250 },
        data: { label: 'Agent AI' },
      },
      // Main Operator Node
      {
        id: 'operator',
        type: 'operator',
        position: { x: 500, y: 250 },
        data: { label: 'Operator' },
      },
    ];

    // Add action nodes in an arc around the agent
    const agentCenterX = 300;
    const agentCenterY = 250;
    const radius = 100;
    
    // Arc positions around the agent (left side)
    const arcPositions = [
      { x: agentCenterX - radius + 80, y: agentCenterY - 90 },     // Top left
      { x: agentCenterX - radius , y: agentCenterY - 30 }, // Upper left
      { x: agentCenterX - radius , y: agentCenterY + 60 }, // Middle left
      { x: agentCenterX - radius + 80, y: agentCenterY + 120 }, // Lower left
    ];
    
    agentActions.forEach((action, index) => {
      const position = arcPositions[index] || { 
        x: agentCenterX - radius, 
        y: agentCenterY - 50 + index * 50 
      };
      
      nodes.push({
        id: action.id,
        type: 'action',
        position: position,
        data: {
          ...action,
        },
      });
    });

    return nodes;
  }, []);

  // Create edges (connections)
  const initialEdges = useMemo(() => {
    const edges = [
      // Main connection between Agent and Operator
      {
        id: 'agent-operator',
        source: 'agent',
        sourceHandle: 'right',
        target: 'operator',
        targetHandle: 'left',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 3 },
        label: 'Colaborare',
        labelStyle: { fill: '#374151', fontWeight: 600 },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
        markerEnd: {
          width: 20,
          height: 20,
          color: '#3b82f6',
        },
      },
    ];



    return edges;
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Update nodes when initialNodes changes
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // Update edges when initialEdges changes
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Calculate progress for human vs AI actions
  const totalActions = agentActions.length;
  const activeAIActions = 0; // Static for now
  const activeHumanActions = 0; // Static for now
  const totalActiveActions = activeAIActions + activeHumanActions;

  const aiPercentage = totalActions > 0 ? (activeAIActions / totalActions) * 100 : 0;
  const humanPercentage = totalActions > 0 ? (activeHumanActions / totalActions) * 100 : 0;

  return (
    <div className={styles.graphContainer}>
      <div className={styles.graphCanvas}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1.2 }}
          attributionPosition="bottom-left"
          className={styles.reactFlow}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
        >
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      
      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressContainer}>
          <div 
            className={`${styles.progressSegment} ${styles.aiProgress}`}
            style={{ width: `${aiPercentage}%` }}
          >
            <span className={styles.progressLabel}>AI</span>
          </div>
          <div 
            className={`${styles.progressSegment} ${styles.humanProgress}`}
            style={{ width: `${humanPercentage}%` }}
          >
            <span className={styles.progressLabel}>Umane</span>
          </div>
        </div>
        <div className={styles.progressStats}>
          {activeAIActions} AI / {activeHumanActions} Umane
        </div>
      </div>
    </div>
  );
};

export default Graph;