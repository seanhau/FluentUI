import { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  makeStyles,
  tokens,
  Tab,
  TabList,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Field,
  Dropdown,
  Option,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from '@fluentui/react-components';
import {
  Add24Regular,
  Delete24Regular,
  Edit24Regular,
  Document24Regular,
  TableAdd24Regular,
  DocumentText24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  sidebar: {
    width: '280px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: tokens.spacingVerticalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  sidebarContent: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: tokens.spacingVerticalM,
  },
  sectionItem: {
    padding: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalL,
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusSmall,
    marginBottom: tokens.spacingVerticalXS,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  sectionItemActive: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  toolbar: {
    padding: tokens.spacingVerticalM,
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingHorizontalXL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
  documentArea: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: tokens.spacingVerticalXXL,
    paddingLeft: tokens.spacingHorizontalXXL,
    paddingRight: tokens.spacingHorizontalXXL,
  },
  section: {
    marginBottom: tokens.spacingVerticalXXL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalXL,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalM,
    borderBottom: `2px solid ${tokens.colorNeutralStroke2}`,
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  textContent: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: '1.8',
    color: tokens.colorNeutralForeground2,
    whiteSpace: 'pre-wrap',
  },
  tableContainer: {
    marginTop: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    overflow: 'hidden',
  },
  tableCell: {
    padding: tokens.spacingVerticalS,
    fontSize: tokens.fontSizeBase300,
  },
  tableHeaderCell: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: tokens.fontWeightSemibold,
    padding: tokens.spacingVerticalS,
  },
});

interface TableData {
  id: string;
  columns: string[];
  rows: string[][];
}

interface TextSection {
  id: string;
  title: string;
  content: string;
  type: 'text';
}

interface TableSection {
  id: string;
  title: string;
  type: 'table';
  table: TableData;
}

type Section = TextSection | TableSection;

export const DocumentViewer = () => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState<'contents' | 'issues'>('contents');
  const [activeSection, setActiveSection] = useState<string>('1');
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Cover Page',
      content: 'Document Title: World Building Guide\nVersion: 1.0\nDate: 2024\nAuthor: Your Name',
      type: 'text',
    },
    {
      id: '2',
      title: 'Table of Contents',
      content: '1. Objective\n2. Scope\n3. Pre-Requisites\n4. Test Cases\n5. Operating Procedures\n6. References',
      type: 'text',
    },
    {
      id: '3',
      title: 'Operating Procedures',
      type: 'table',
      table: {
        id: 't1',
        columns: ['#', 'Procedure', 'Expected Result', 'Actual Result', 'Pass/Fail', 'Signature', 'Witness'],
        rows: [
          ['1', 'Verify all Current Quality and Manufacturing Supporting Procedures have been reviewed', 'All Current Quality and Manufacturing Supporting Procedures have been reviewed', '', '', '', ''],
          ['2', '', '', '', '', '', ''],
          ['3', '', '', '', '', '', ''],
        ],
      },
    },
    {
      id: '4',
      title: 'Test Information',
      type: 'table',
      table: {
        id: 't2',
        columns: ['Test ID', 'Test Description', 'Acceptance Criteria', 'Specification Reference', 'Risk Assessment Reference'],
        rows: [
          ['IQ-EQ-003-02-TC-001', 'To verify that applicable evidence is attached to show that applicable procedures have been established or updated for the inclusion of the new BIG-PM-01', 'Valid evidence/procedures have been established or updated for the inclusion of the new BIG-PM-01', 'XIX-534', ''],
        ],
      },
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [newSectionType, setNewSectionType] = useState<'text' | 'table'>('text');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');
  const [newTableColumns, setNewTableColumns] = useState('3');

  const addSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: Section = newSectionType === 'text'
      ? {
          id: Date.now().toString(),
          title: newSectionTitle,
          content: newSectionContent,
          type: 'text',
        }
      : {
          id: Date.now().toString(),
          title: newSectionTitle,
          type: 'table',
          table: {
            id: `t${Date.now()}`,
            columns: Array.from({ length: parseInt(newTableColumns) }, (_, i) => `Column ${i + 1}`),
            rows: [Array.from({ length: parseInt(newTableColumns) }, () => '')],
          },
        };

    setSections([...sections, newSection]);
    setNewSectionTitle('');
    setNewSectionContent('');
    setShowAddDialog(false);
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    if (activeSection === id && sections.length > 0) {
      setActiveSection(sections[0].id);
    }
  };

  const startEdit = (section: Section) => {
    setEditingSection(JSON.parse(JSON.stringify(section)));
    setShowEditDialog(true);
  };

  const saveEdit = () => {
    if (!editingSection) return;
    setSections(sections.map(s => s.id === editingSection.id ? editingSection : s));
    setEditingSection(null);
    setShowEditDialog(false);
  };

  const updateTableCell = (rowIndex: number, colIndex: number, value: string) => {
    if (!editingSection || editingSection.type !== 'table') return;
    const newRows = [...editingSection.table.rows];
    newRows[rowIndex][colIndex] = value;
    setEditingSection({
      ...editingSection,
      table: { ...editingSection.table, rows: newRows },
    });
  };

  const addTableRow = () => {
    if (!editingSection || editingSection.type !== 'table') return;
    const newRow = Array.from({ length: editingSection.table.columns.length }, () => '');
    setEditingSection({
      ...editingSection,
      table: {
        ...editingSection.table,
        rows: [...editingSection.table.rows, newRow],
      },
    });
  };

  const updateColumnName = (colIndex: number, value: string) => {
    if (!editingSection || editingSection.type !== 'table') return;
    const newColumns = [...editingSection.table.columns];
    newColumns[colIndex] = value;
    setEditingSection({
      ...editingSection,
      table: { ...editingSection.table, columns: newColumns },
    });
  };

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <TabList selectedValue={activeTab} onTabSelect={(_, data) => setActiveTab(data.value as 'contents' | 'issues')}>
            <Tab value="contents">Contents</Tab>
            <Tab value="issues">Issues</Tab>
          </TabList>
        </div>
        <div className={styles.sidebarContent}>
          {activeTab === 'contents' && sections.map((section, index) => (
            <div
              key={section.id}
              className={`${styles.sectionItem} ${activeSection === section.id ? styles.sectionItemActive : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <Document24Regular />
              <span>{index + 1}. {section.title}</span>
            </div>
          ))}
          {activeTab === 'issues' && (
            <div style={{ padding: tokens.spacingVerticalM, color: tokens.colorNeutralForeground3 }}>
              No issues found
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.toolbar}>
          <Button
            appearance="primary"
            icon={<DocumentText24Regular />}
            onClick={() => {
              setNewSectionType('text');
              setShowAddDialog(true);
            }}
          >
            Add Text Section
          </Button>
          <Button
            appearance="primary"
            icon={<TableAdd24Regular />}
            onClick={() => {
              setNewSectionType('table');
              setShowAddDialog(true);
            }}
          >
            Add Table Section
          </Button>
        </div>

        <div className={styles.documentArea}>
          {currentSection && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{currentSection.title}</h2>
                <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
                  <Button
                    appearance="subtle"
                    icon={<Edit24Regular />}
                    onClick={() => startEdit(currentSection)}
                  >
                    Edit
                  </Button>
                  <Button
                    appearance="subtle"
                    icon={<Delete24Regular />}
                    onClick={() => deleteSection(currentSection.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {currentSection.type === 'text' ? (
                <div className={styles.textContent}>{currentSection.content}</div>
              ) : (
                <div className={styles.tableContainer}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {currentSection.table.columns.map((col, i) => (
                          <TableHeaderCell key={i} className={styles.tableHeaderCell}>
                            {col}
                          </TableHeaderCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSection.table.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex} className={styles.tableCell}>
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Section Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(e, data) => setShowAddDialog(data.open)}>
        <DialogSurface style={{ maxWidth: '600px' }}>
          <DialogBody>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogContent>
              <Field label="Section Title">
                <Input
                  value={newSectionTitle}
                  onChange={(e, data) => setNewSectionTitle(data.value)}
                  placeholder="Enter section title"
                />
              </Field>

              {newSectionType === 'text' ? (
                <Field label="Content" style={{ marginTop: tokens.spacingVerticalM }}>
                  <Textarea
                    value={newSectionContent}
                    onChange={(e, data) => setNewSectionContent(data.value)}
                    placeholder="Enter section content"
                    rows={8}
                  />
                </Field>
              ) : (
                <Field label="Number of Columns" style={{ marginTop: tokens.spacingVerticalM }}>
                  <Dropdown
                    value={`${newTableColumns} columns`}
                    onOptionSelect={(e, data) => setNewTableColumns(data.optionValue as string)}
                  >
                    <Option value="3">3 columns</Option>
                    <Option value="4">4 columns</Option>
                    <Option value="5">5 columns</Option>
                    <Option value="6">6 columns</Option>
                    <Option value="7">7 columns</Option>
                  </Dropdown>
                </Field>
              )}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={addSection}>
                Add Section
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(e, data) => setShowEditDialog(data.open)}>
        <DialogSurface style={{ maxWidth: '900px', maxHeight: '80vh' }}>
          <DialogBody>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogContent style={{ overflowY: 'auto' }}>
              {editingSection && (
                <>
                  <Field label="Section Title">
                    <Input
                      value={editingSection.title}
                      onChange={(e, data) => setEditingSection({ ...editingSection, title: data.value })}
                    />
                  </Field>

                  {editingSection.type === 'text' ? (
                    <Field label="Content" style={{ marginTop: tokens.spacingVerticalM }}>
                      <Textarea
                        value={editingSection.content}
                        onChange={(e, data) => setEditingSection({ ...editingSection, content: data.value })}
                        rows={12}
                      />
                    </Field>
                  ) : (
                    <div style={{ marginTop: tokens.spacingVerticalM }}>
                      <h4 style={{ marginBottom: tokens.spacingVerticalS }}>Column Headers</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalM }}>
                        {editingSection.table.columns.map((col, i) => (
                          <Input
                            key={i}
                            value={col}
                            onChange={(e, data) => updateColumnName(i, data.value)}
                            size="small"
                          />
                        ))}
                      </div>

                      <h4 style={{ marginBottom: tokens.spacingVerticalS }}>Table Data</h4>
                      {editingSection.table.rows.map((row, rowIndex) => (
                        <div key={rowIndex} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalS }}>
                          {row.map((cell, cellIndex) => (
                            <Input
                              key={cellIndex}
                              value={cell}
                              onChange={(e, data) => updateTableCell(rowIndex, cellIndex, data.value)}
                              size="small"
                            />
                          ))}
                        </div>
                      ))}
                      <Button
                        appearance="subtle"
                        icon={<Add24Regular />}
                        onClick={addTableRow}
                        style={{ marginTop: tokens.spacingVerticalS }}
                      >
                        Add Row
                      </Button>
                    </div>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={saveEdit}>
                Save Changes
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

// Made with Bob
