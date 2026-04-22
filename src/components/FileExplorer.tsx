import { useState } from 'react';
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
} from '@fluentui/react-components';
import {
  Folder24Regular,
  Document24Regular,
  DocumentJavascript24Regular,
  DocumentCss24Regular,
  DocumentImageRegular,
  DocumentText24Regular,
  ArrowLeft24Regular,
  Home24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
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
}

const sampleFileStructure: FileItem[] = [
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
  if (!folderId) return 'Root';
  
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
  
  return 'Root > ' + path.join(' > ');
};

export const FileExplorer = () => {
  const styles = useStyles();
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<(string | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);


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
      return sampleFileStructure;
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

    const folder = findFolder(sampleFileStructure, currentFolder);
    return folder?.children || [];
  };

  const items = getCurrentFolderItems();
  const currentPath = buildPath(currentFolder, sampleFileStructure);
  const canGoBack = historyIndex > 0;

  const columns: TableColumnDefinition<FileItem>[] = [
    createTableColumn<FileItem>({
      columnId: 'name',
      compare: (a, b) => a.name.localeCompare(b.name),
      renderHeaderCell: () => 'Name',
      renderCell: (item) => {
        const isFolder = item.type === 'folder';

        return (
          <TableCellLayout
            media={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isFolder ? <Folder24Regular /> : getFileIcon(item.name, item.type)}
              </div>
            }
          >
            <span
              style={{ cursor: isFolder ? 'pointer' : 'default' }}
              onClick={() => isFolder && navigateToFolder(item.id)}
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
    <div style={{ width: '100%', maxWidth: '1200px' }}>
      <h2 style={{ marginBottom: '16px' }}>File Explorer</h2>
      
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
        <Input
          className={styles.addressBar}
          value={currentPath}
          readOnly
          contentBefore={<Folder24Regular />}
        />
      </div>

      {/* File Grid */}
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
  );
};

