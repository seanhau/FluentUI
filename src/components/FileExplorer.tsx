import { useState} from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  TableCellLayout,
  type TableColumnDefinition,
  createTableColumn,
  Button,
  Input,
  makeStyles,
  tokens,
  Tree,
  TreeItem,
  TreeItemLayout,
  type TreeOpenChangeData,
  type TreeOpenChangeEvent,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Field,
} from '@fluentui/react-components';
import {
  Folder24Regular,
  FolderOpen24Regular,
  Document24Regular,
  DocumentJavascript24Regular,
  DocumentCss24Regular,
  DocumentImageRegular,
  DocumentText24Regular,
  ArrowLeft24Regular,
  Home24Regular,
  FolderAdd24Regular,
  DocumentAdd24Regular,
  LockClosed24Regular,
  Person24Regular,
  Shield24Regular,
  Eye24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    width: '100%',
    maxWidth: '1400px',
  },
  sidebar: {
    width: '250px',
    minWidth: '250px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: tokens.spacingVerticalM,
    maxHeight: '600px',
    overflowY: 'auto',
  },
  mainContent: {
    flexGrow: 1,
    minWidth: 0,
  },
  navigationBar: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  addressBar: {
    flexGrow: 1,
  },
  sidebarTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
    color: tokens.colorNeutralForeground1,
  },
  accessSection: {
    marginBottom: tokens.spacingVerticalL,
  },
  accessSectionTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground1,
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground2,
    marginBottom: tokens.spacingVerticalXS,
  },
  userName: {
    flexGrow: 1,
    fontSize: tokens.fontSizeBase300,
  },
  userEmail: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
});

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  dateModified: Date;
  size: number; // in bytes
  kind: string;
  children?: FileItem[];
  level: number;
  parentId?: string;
  isDocument?: boolean;
  documentData?: any;
}

interface AccessUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

const sampleAccessUsers: AccessUser[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@company.com', role: 'admin' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'admin' },
  { id: '3', name: 'Mike Davis', email: 'mike.davis@company.com', role: 'viewer' },
  { id: '4', name: 'Emily Brown', email: 'emily.b@company.com', role: 'viewer' },
  { id: '5', name: 'David Wilson', email: 'd.wilson@company.com', role: 'viewer' },
];

const sampleFileStructure: FileItem[] = [
  {
    id: 'docs',
    name: 'Documents',
    type: 'folder',
    dateModified: new Date('2024-03-25T10:00:00'),
    size: 0,
    kind: 'Folder',
    level: 0,
    children: [
      {
        id: 'doc-1',
        name: 'Quality Assurance Protocol.docx',
        type: 'file',
        dateModified: new Date('2024-03-25T14:30:00'),
        size: 45678,
        kind: 'Document',
        level: 1,
        parentId: 'docs',
        isDocument: true,
        documentData: {
          id: 'doc-1',
          title: 'Quality Assurance Protocol',
          sections: [
            {
              id: '1',
              title: 'Document Information',
              content: 'Document Title: Quality Assurance Protocol\nVersion: 2.1\nDate: March 25, 2024\nAuthor: QA Department\nApproved By: John Smith',
              type: 'text',
            },
            {
              id: '2',
              title: 'Objective',
              content: 'This document outlines the quality assurance procedures and protocols to ensure all products meet the required standards and specifications before release.',
              type: 'text',
            },
            {
              id: '3',
              title: 'Test Cases',
              type: 'table',
              table: {
                id: 't1',
                columns: ['Test ID', 'Test Description', 'Expected Result', 'Status', 'Tester'],
                rows: [
                  ['QA-001', 'Verify product dimensions', 'All dimensions within ±0.5mm tolerance', 'Passed', 'Sarah Johnson'],
                  ['QA-002', 'Check material composition', 'Material matches specification sheet', 'Passed', 'Mike Davis'],
                  ['QA-003', 'Perform stress test', 'Product withstands 150% rated load', 'In Progress', 'Emily Brown'],
                ],
              },
            },
          ],
        },
      },
      {
        id: 'doc-2',
        name: 'Manufacturing Procedures.docx',
        type: 'file',
        dateModified: new Date('2024-03-24T11:15:00'),
        size: 67890,
        kind: 'Document',
        level: 1,
        parentId: 'docs',
        isDocument: true,
        documentData: {
          id: 'doc-2',
          title: 'Manufacturing Procedures',
          sections: [
            {
              id: '1',
              title: 'Cover Page',
              content: 'Document Title: Manufacturing Procedures\nVersion: 3.0\nDate: March 24, 2024\nDepartment: Manufacturing\nReviewed By: David Wilson',
              type: 'text',
            },
            {
              id: '2',
              title: 'Operating Procedures',
              type: 'table',
              table: {
                id: 't1',
                columns: ['Step', 'Procedure', 'Expected Result', 'Actual Result', 'Pass/Fail', 'Operator'],
                rows: [
                  ['1', 'Verify all raw materials are in stock', 'All materials available and within expiry date', '', '', ''],
                  ['2', 'Set up manufacturing equipment', 'Equipment calibrated and ready', '', '', ''],
                  ['3', 'Begin production run', 'First article inspection passed', '', '', ''],
                  ['4', 'Quality check at 50% completion', 'All measurements within tolerance', '', '', ''],
                ],
              },
            },
            {
              id: '3',
              title: 'Safety Requirements',
              content: '1. All operators must wear appropriate PPE\n2. Emergency stop buttons must be tested daily\n3. Work area must be kept clean and organized\n4. Report any equipment malfunctions immediately',
              type: 'text',
            },
          ],
        },
      },
      {
        id: 'doc-3',
        name: 'Equipment Validation Report.docx',
        type: 'file',
        dateModified: new Date('2024-03-23T16:45:00'),
        size: 34567,
        kind: 'Document',
        level: 1,
        parentId: 'docs',
        isDocument: true,
        documentData: {
          id: 'doc-3',
          title: 'Equipment Validation Report',
          sections: [
            {
              id: '1',
              title: 'Executive Summary',
              content: 'This report documents the validation of Equipment Model XYZ-2000 installed in Production Line A. All validation tests have been completed successfully.',
              type: 'text',
            },
            {
              id: '2',
              title: 'Validation Test Results',
              type: 'table',
              table: {
                id: 't1',
                columns: ['Test ID', 'Description', 'Acceptance Criteria', 'Result', 'Date', 'Validator'],
                rows: [
                  ['VAL-001', 'Installation Qualification', 'Equipment installed per specifications', 'Pass', '2024-03-20', 'John Smith'],
                  ['VAL-002', 'Operational Qualification', 'All functions operate correctly', 'Pass', '2024-03-21', 'Sarah Johnson'],
                  ['VAL-003', 'Performance Qualification', 'Meets production requirements', 'Pass', '2024-03-22', 'Mike Davis'],
                ],
              },
            },
          ],
        },
      },
    ],
  },
  {
    id: '1',
    name: 'src',
    type: 'folder',
    dateModified: new Date('2024-03-15T10:30:00'),
    size: 0,
    kind: 'Folder',
    level: 0,
    children: [
      {
        id: '1-1',
        name: 'components',
        type: 'folder',
        dateModified: new Date('2024-03-20T14:20:00'),
        size: 0,
        kind: 'Folder',
        level: 1,
        parentId: '1',
        children: [
          {
            id: '1-1-1',
            name: 'FileExplorer.tsx',
            type: 'file',
            dateModified: new Date('2024-03-22T09:15:00'),
            size: 8456,
            kind: 'TypeScript React',
            level: 2,
            parentId: '1-1',
          },
          {
            id: '1-1-2',
            name: 'Header.tsx',
            type: 'file',
            dateModified: new Date('2024-03-18T16:45:00'),
            size: 2341,
            kind: 'TypeScript React',
            level: 2,
            parentId: '1-1',
          },
        ],
      },
      {
        id: '1-2',
        name: 'assets',
        type: 'folder',
        dateModified: new Date('2024-03-10T11:00:00'),
        size: 0,
        kind: 'Folder',
        level: 1,
        parentId: '1',
        children: [
          {
            id: '1-2-1',
            name: 'logo.png',
            type: 'file',
            dateModified: new Date('2024-03-10T11:00:00'),
            size: 45678,
            kind: 'PNG Image',
            level: 2,
            parentId: '1-2',
          },
          {
            id: '1-2-2',
            name: 'hero.png',
            type: 'file',
            dateModified: new Date('2024-03-10T11:05:00'),
            size: 123456,
            kind: 'PNG Image',
            level: 2,
            parentId: '1-2',
          },
        ],
      },
      {
        id: '1-3',
        name: 'App.tsx',
        type: 'file',
        dateModified: new Date('2024-03-22T15:30:00'),
        size: 5234,
        kind: 'TypeScript React',
        level: 1,
        parentId: '1',
      },
      {
        id: '1-4',
        name: 'App.css',
        type: 'file',
        dateModified: new Date('2024-03-21T10:20:00'),
        size: 1876,
        kind: 'CSS Stylesheet',
        level: 1,
        parentId: '1',
      },
      {
        id: '1-5',
        name: 'main.tsx',
        type: 'file',
        dateModified: new Date('2024-03-22T08:00:00'),
        size: 456,
        kind: 'TypeScript React',
        level: 1,
        parentId: '1',
      },
      {
        id: '1-6',
        name: 'index.css',
        type: 'file',
        dateModified: new Date('2024-03-15T14:30:00'),
        size: 987,
        kind: 'CSS Stylesheet',
        level: 1,
        parentId: '1',
      },
    ],
  },
  {
    id: '2',
    name: 'public',
    type: 'folder',
    dateModified: new Date('2024-03-08T09:00:00'),
    size: 0,
    kind: 'Folder',
    level: 0,
    children: [
      {
        id: '2-1',
        name: 'favicon.svg',
        type: 'file',
        dateModified: new Date('2024-03-08T09:00:00'),
        size: 1234,
        kind: 'SVG Image',
        level: 1,
        parentId: '2',
      },
      {
        id: '2-2',
        name: 'icons.svg',
        type: 'file',
        dateModified: new Date('2024-03-08T09:05:00'),
        size: 3456,
        kind: 'SVG Image',
        level: 1,
        parentId: '2',
      },
    ],
  },
  {
    id: '3',
    name: 'package.json',
    type: 'file',
    dateModified: new Date('2024-03-22T12:00:00'),
    size: 678,
    kind: 'JSON File',
    level: 0,
  },
  {
    id: '4',
    name: 'tsconfig.json',
    type: 'file',
    dateModified: new Date('2024-03-15T10:00:00'),
    size: 432,
    kind: 'JSON File',
    level: 0,
  },
  {
    id: '5',
    name: 'vite.config.ts',
    type: 'file',
    dateModified: new Date('2024-03-15T10:15:00'),
    size: 234,
    kind: 'TypeScript',
    level: 0,
  },
  {
    id: '6',
    name: 'README.md',
    type: 'file',
    dateModified: new Date('2024-03-15T09:00:00'),
    size: 1567,
    kind: 'Markdown',
    level: 0,
  },
];

const getFileIcon = (fileName: string, type: string) => {
  if (type === 'folder') {
    return null; // Will be handled by expand/collapse icon
  }

  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return <DocumentJavascript24Regular />;
    case 'css':
    case 'scss':
    case 'sass':
      return <DocumentCss24Regular />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <DocumentImageRegular />;
    case 'md':
    case 'txt':
      return <DocumentText24Regular />;
    default:
      return <Document24Regular />;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '--';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return diffDays + ' days ago';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

// Helper function to build path from root to current folder
const buildPath = (folderId: string | null, allItems: FileItem[]): string => {
  if (!folderId) return 'This PC';
  
  const path: string[] = [];
  let currentId: string | undefined = folderId;
  
  const findItemById = (items: FileItem[], id: string): FileItem | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };
  
  while (currentId) {
    const item = findItemById(allItems, currentId);
    if (item) {
      path.unshift(item.name);
      currentId = item.parentId;
    } else {
      break;
    }
  }
  
  return 'This PC > ' + path.join(' > ');
};

interface FileExplorerProps {
  onDocumentOpen?: (documentData: any) => void;
}

export const FileExplorer = ({ onDocumentOpen }: FileExplorerProps) => {
  const styles = useStyles();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', 'docs']));
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<(string | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [fileStructure, setFileStructure] = useState<FileItem[]>(sampleFileStructure);
  const [showManageAccessDialog, setShowManageAccessDialog] = useState(false);
  const [accessUsers] = useState<AccessUser[]>(sampleAccessUsers);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  };

  const createNewFolder = () => {
    if (!newItemName.trim()) return;
    
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newItemName,
      type: 'folder',
      dateModified: new Date(),
      size: 0,
      kind: 'Folder',
      level: currentFolder ? 1 : 0,
      parentId: currentFolder || undefined,
      children: [],
    };

    setFileStructure(prev => {
      if (!currentFolder) {
        return [...prev, newFolder];
      }
      
      const addToFolder = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.id === currentFolder) {
            return {
              ...item,
              children: [...(item.children || []), newFolder],
            };
          }
          if (item.children) {
            return {
              ...item,
              children: addToFolder(item.children),
            };
          }
          return item;
        });
      };
      
      return addToFolder(prev);
    });

    setNewItemName('');
    setShowNewFolderDialog(false);
  };

  const createNewFile = () => {
    if (!newItemName.trim()) return;
    
    const extension = newItemName.split('.').pop()?.toLowerCase() || 'txt';
    let kind = 'File';
    
    if (['ts', 'tsx'].includes(extension)) kind = 'TypeScript React';
    else if (['js', 'jsx'].includes(extension)) kind = 'JavaScript';
    else if (extension === 'css') kind = 'CSS Stylesheet';
    else if (['png', 'jpg', 'jpeg', 'gif'].includes(extension)) kind = 'Image';
    else if (extension === 'json') kind = 'JSON File';
    else if (extension === 'md') kind = 'Markdown';

    const newFile: FileItem = {
      id: Date.now().toString(),
      name: newItemName,
      type: 'file',
      dateModified: new Date(),
      size: 0,
      kind,
      level: currentFolder ? 1 : 0,
      parentId: currentFolder || undefined,
    };

    setFileStructure(prev => {
      if (!currentFolder) {
        return [...prev, newFile];
      }
      
      const addToFolder = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.id === currentFolder) {
            return {
              ...item,
              children: [...(item.children || []), newFile],
            };
          }
          if (item.children) {
            return {
              ...item,
              children: addToFolder(item.children),
            };
          }
          return item;
        });
      };
      
      return addToFolder(prev);
    });

    setNewItemName('');
    setShowNewFileDialog(false);
  };

  const handleTreeOpenChange = (_: TreeOpenChangeEvent, data: TreeOpenChangeData) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (data.open) {
        newSet.add(data.value as string);
      } else {
        newSet.delete(data.value as string);
      }
      return newSet;
    });
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    // Add to history
    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentFolder(navigationHistory[historyIndex - 1]);
    }
  };

  const goHome = () => {
    navigateToFolder(null);
  };

  const getCurrentFolderItems = (): FileItem[] => {
    if (!currentFolder) {
      return fileStructure;
    }

    const findFolder = (items: FileItem[], id: string): FileItem | undefined => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findFolder(item.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };

    const folder = findFolder(fileStructure, currentFolder);
    return folder?.children || [];
  };

  const renderTreeItem = (node: FileItem) => {
    const isOpen = expandedFolders.has(node.id);
    
    if (node.type === 'folder') {
      return (
        <TreeItem
          key={node.id}
          itemType="branch"
          value={node.id}
        >
          <TreeItemLayout
            iconBefore={isOpen ? <FolderOpen24Regular /> : <Folder24Regular />}
            onClick={() => navigateToFolder(node.id)}
            style={{ cursor: 'pointer' }}
          >
            {node.name}
          </TreeItemLayout>
          <Tree>
            {node.children?.filter(child => child.type === 'folder').map((child) => renderTreeItem(child))}
          </Tree>
        </TreeItem>
      );
    }

    return <></>;
  };

  const items = getCurrentFolderItems();
  const currentPath = buildPath(currentFolder, fileStructure);
  const canGoBack = historyIndex > 0;

  const columns: TableColumnDefinition<FileItem>[] = [
    createTableColumn<FileItem>({
      columnId: 'name',
      compare: (a, b) => a.name.localeCompare(b.name),
      renderHeaderCell: () => 'Name',
      renderCell: (item) => {
        const isFolder = item.type === 'folder';
        const isClickable = isFolder || item.isDocument;

        return (
          <TableCellLayout
            media={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isFolder ? <Folder24Regular /> : getFileIcon(item.name, item.type)}
              </div>
            }
          >
            <span
              style={{ cursor: isClickable ? 'pointer' : 'default', color: item.isDocument ? tokens.colorBrandForeground1 : 'inherit' }}
              onClick={() => {
                if (isFolder) {
                  navigateToFolder(item.id);
                } else if (item.isDocument && item.documentData && onDocumentOpen) {
                  onDocumentOpen(item.documentData);
                }
              }}
            >
              {item.name}
            </span>
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<FileItem>({
      columnId: 'dateModified',
      compare: (a, b) => a.dateModified.getTime() - b.dateModified.getTime(),
      renderHeaderCell: () => 'Date Modified',
      renderCell: (item) => formatDate(item.dateModified),
    }),
    createTableColumn<FileItem>({
      columnId: 'size',
      compare: (a, b) => a.size - b.size,
      renderHeaderCell: () => 'Size',
      renderCell: (item) => formatFileSize(item.size),
    }),
    createTableColumn<FileItem>({
      columnId: 'kind',
      compare: (a, b) => a.kind.localeCompare(b.kind),
      renderHeaderCell: () => 'Kind',
      renderCell: (item) => item.kind,
    }),
  ];

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ marginBottom: '16px' }}>File Explorer</h2>
      
      <div className={styles.container}>
        {/* Sidebar with folder tree */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Folders</div>
          <Tree
            aria-label="Folder Navigation"
            openItems={expandedFolders}
            onOpenChange={handleTreeOpenChange}
          >
            <TreeItem
              itemType="leaf"
              value="root"
            >
              <TreeItemLayout
                iconBefore={<Home24Regular />}
                onClick={goHome}
                style={{ cursor: 'pointer', fontWeight: currentFolder === null ? 'bold' : 'normal' }}
              >
                This PC
              </TreeItemLayout>
            </TreeItem>
            {fileStructure.filter(item => item.type === 'folder').map((node) => renderTreeItem(node))}
          </Tree>
        </div>

        {/* Main content area */}
        <div className={styles.mainContent}>
          {/* Navigation Bar */}
          <div className={styles.navigationBar}>
            <Button
              appearance="subtle"
              icon={<ArrowLeft24Regular />}
              onClick={goBack}
              disabled={!canGoBack}
              title="Back"
            />
            <Button
              appearance="subtle"
              icon={<Home24Regular />}
              onClick={goHome}
              title="Home"
            />
            <Button
              appearance="subtle"
              icon={<LockClosed24Regular />}
              onClick={() => setShowManageAccessDialog(true)}
              title="Manage Access"
            >
              Manage Access
            </Button>
            <Input
              className={styles.addressBar}
              value={currentPath}
              readOnly
              contentBefore={<Folder24Regular />}
            />
          </div>

          {/* File Grid */}
          <div onContextMenu={handleContextMenu}>
            <DataGrid
              items={items}
              columns={columns}
              sortable
              getRowId={(item) => item.id}
              focusMode="composite"
              style={{ minWidth: '100%' }}
            >
              <DataGridHeader>
                <DataGridRow>
                  {({ renderHeaderCell }) => (
                    <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                  )}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<FileItem>>
                {({ item, rowId }) => (
                  <DataGridRow<FileItem> key={rowId}>
                    {({ renderCell }) => (
                      <DataGridCell>{renderCell(item)}</DataGridCell>
                    )}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>

          {/* Context Menu */}
          <Menu open={contextMenuOpen} onOpenChange={(e, data) => setContextMenuOpen(data.open)}>
            <MenuTrigger disableButtonEnhancement>
              <div style={{ position: 'fixed', left: contextMenuPosition.x, top: contextMenuPosition.y, width: 0, height: 0 }} />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem icon={<FolderAdd24Regular />} onClick={() => { setShowNewFolderDialog(true); setContextMenuOpen(false); }}>
                  New Folder
                </MenuItem>
                <MenuItem icon={<DocumentAdd24Regular />} onClick={() => { setShowNewFileDialog(true); setContextMenuOpen(false); }}>
                  New File
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>

          {/* New Folder Dialog */}
          <Dialog open={showNewFolderDialog} onOpenChange={(e, data) => setShowNewFolderDialog(data.open)}>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogContent>
                  <Field label="Folder name">
                    <Input
                      value={newItemName}
                      onChange={(e, data) => setNewItemName(data.value)}
                      placeholder="New folder"
                      onKeyDown={(e) => e.key === 'Enter' && createNewFolder()}
                    />
                  </Field>
                </DialogContent>
                <DialogActions>
                  <Button appearance="secondary" onClick={() => { setShowNewFolderDialog(false); setNewItemName(''); }}>
                    Cancel
                  </Button>
                  <Button appearance="primary" onClick={createNewFolder}>
                    Create
                  </Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>

          {/* New File Dialog */}
          <Dialog open={showNewFileDialog} onOpenChange={(e, data) => setShowNewFileDialog(data.open)}>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Create New File</DialogTitle>
                <DialogContent>
                  <Field label="File name">
                    <Input
                      value={newItemName}
                      onChange={(e, data) => setNewItemName(data.value)}
                      placeholder="newfile.txt"
                      onKeyDown={(e) => e.key === 'Enter' && createNewFile()}
                    />
                  </Field>
                </DialogContent>
                <DialogActions>
                  <Button appearance="secondary" onClick={() => { setShowNewFileDialog(false); setNewItemName(''); }}>
                    Cancel
                  </Button>
                  <Button appearance="primary" onClick={createNewFile}>
                    Create
                  </Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>

          {/* Manage Access Dialog */}
          <Dialog open={showManageAccessDialog} onOpenChange={(e, data) => setShowManageAccessDialog(data.open)}>
            <DialogSurface style={{ maxWidth: '600px' }}>
              <DialogBody>
                <DialogTitle>Manage Access</DialogTitle>
                <DialogContent>
                  {/* Admin Access Section */}
                  <div className={styles.accessSection}>
                    <div className={styles.accessSectionTitle}>
                      <Shield24Regular />
                      <span>Admin Access</span>
                    </div>
                    {accessUsers
                      .filter(user => user.role === 'admin')
                      .map(user => (
                        <div key={user.id} className={styles.userItem}>
                          <Person24Regular />
                          <div style={{ flexGrow: 1 }}>
                            <div className={styles.userName}>{user.name}</div>
                            <div className={styles.userEmail}>{user.email}</div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Viewer Access Section */}
                  <div className={styles.accessSection}>
                    <div className={styles.accessSectionTitle}>
                      <Eye24Regular />
                      <span>Viewer Access</span>
                    </div>
                    {accessUsers
                      .filter(user => user.role === 'viewer')
                      .map(user => (
                        <div key={user.id} className={styles.userItem}>
                          <Person24Regular />
                          <div style={{ flexGrow: 1 }}>
                            <div className={styles.userName}>{user.name}</div>
                            <div className={styles.userEmail}>{user.email}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button appearance="primary" onClick={() => setShowManageAccessDialog(false)}>
                    Close
                  </Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

