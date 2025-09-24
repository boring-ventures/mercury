"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { FontFamily } from "@tiptap/extension-font-family";
import { pdf } from "@react-pdf/renderer";
import ContractPDF from "./contract-pdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Save,
  Eye,
  Download,
  Type,
  Palette,
  FileText,
} from "lucide-react";

interface ContractEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  onPreview: (content: string) => void;
  onDownload: (content: string) => void;
  contractCode: string;
  contract?: any; // Contract data for PDF generation
  isReadOnly?: boolean;
}

export default function ContractEditor({
  initialContent,
  onSave,
  onPreview,
  onDownload,
  contractCode,
  contract,
  isReadOnly = false,
}: ContractEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      FontFamily.configure({
        types: ["textStyle"],
      }),
    ],
    content: initialContent,
    editable: !isReadOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[600px] p-6",
      },
    },
  });

  // Update editor content when initialContent changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    try {
      await onSave(editor.getHTML());
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!editor) return;
    const content = editor.getHTML();
    setIsPreviewMode(!isPreviewMode);
    onPreview(content);
  };

  const handleDownload = async () => {
    if (!editor || !contract) return;

    setIsGeneratingPDF(true);
    try {
      const content = editor.getHTML();

      // Save the contract content first
      await onSave(content);

      // Enhanced HTML-to-PDF generation with better styling preservation
      const generatePDFFromHTML = () => {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Contrato ${contractCode}</title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                @page {
                  margin: 2cm 2.5cm;
                  size: A4;
                  @bottom-center {
                    content: "Página " counter(page) " de " counter(pages);
                    font-size: 10px;
                    color: #666;
                  }
                }
                
                * {
                  box-sizing: border-box;
                }
                
                body {
                  font-family: 'Times New Roman', 'Times', serif;
                  line-height: 1.6;
                  max-width: 100%;
                  margin: 0;
                  padding: 0;
                  font-size: 12px;
                  color: #000;
                  background: white;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }
                
                /* Preserve TipTap editor styles */
                .ProseMirror {
                  outline: none;
                }
                
                /* Headings */
                h1 {
                  text-align: center;
                  font-size: 18px;
                  font-weight: bold;
                  margin: 30px 0 25px 0;
                  text-transform: uppercase;
                  page-break-after: avoid;
                  letter-spacing: 1px;
                }
                
                h2 {
                  font-size: 13px;
                  font-weight: bold;
                  margin: 25px 0 12px 0;
                  text-transform: uppercase;
                  page-break-after: avoid;
                  letter-spacing: 0.5px;
                }
                
                h3 {
                  font-size: 12px;
                  font-weight: bold;
                  margin: 20px 0 10px 0;
                  page-break-after: avoid;
                }
                
                h4, h5, h6 {
                  font-size: 11px;
                  font-weight: bold;
                  margin: 15px 0 8px 0;
                  page-break-after: avoid;
                }
                
                /* Paragraphs */
                p {
                  text-align: justify;
                  margin-bottom: 15px;
                  text-indent: 0;
                  line-height: 1.6;
                  orphans: 3;
                  widows: 3;
                }
                
                /* Text alignment classes from TipTap */
                [style*="text-align: left"], .text-left {
                  text-align: left !important;
                }
                [style*="text-align: center"], .text-center {
                  text-align: center !important;
                }
                [style*="text-align: right"], .text-right {
                  text-align: right !important;
                }
                [style*="text-align: justify"], .text-justify {
                  text-align: justify !important;
                }
                
                /* Lists */
                ul, ol {
                  margin: 10px 0 15px 0;
                  padding-left: 25px;
                }
                
                li {
                  margin-bottom: 8px;
                  line-height: 1.5;
                  page-break-inside: avoid;
                }
                
                ul li {
                  list-style-type: disc;
                }
                
                ol li {
                  list-style-type: decimal;
                }
                
                /* Text formatting */
                strong, b {
                  font-weight: bold;
                }
                
                em, i {
                  font-style: italic;
                }
                
                u {
                  text-decoration: underline;
                }
                
                s, strike {
                  text-decoration: line-through;
                }
                
                /* Font families from TipTap */
                [style*="font-family: Arial"] {
                  font-family: Arial, sans-serif !important;
                }
                [style*="font-family: 'Times New Roman'"] {
                  font-family: 'Times New Roman', Times, serif !important;
                }
                [style*="font-family: Georgia"] {
                  font-family: Georgia, serif !important;
                }
                [style*="font-family: Helvetica"] {
                  font-family: Helvetica, Arial, sans-serif !important;
                }
                [style*="font-family: 'Courier New'"] {
                  font-family: 'Courier New', Courier, monospace !important;
                }
                
                /* Colors */
                [style*="color:"] {
                  /* Preserve inline color styles */
                }
                
                /* Special contract elements */
                .banking-details {
                  margin: 15px 20px;
                  padding: 12px;
                  border: 1px solid #333;
                  background-color: #f9f9f9;
                  page-break-inside: avoid;
                }
                
                .signature-section {
                  margin-top: 80px;
                  display: flex;
                  justify-content: space-between;
                  page-break-inside: avoid;
                  page-break-before: avoid;
                }
                
                .signature-block {
                  text-align: center;
                  width: 45%;
                  border-top: 2px solid #000;
                  padding-top: 15px;
                }
                
                .signature-name {
                  margin-bottom: 40px;
                  font-size: 12px;
                  font-weight: bold;
                }
                
                .signature-title {
                  font-size: 10px;
                  font-weight: bold;
                  text-transform: uppercase;
                }
                
                /* Blockquotes */
                blockquote {
                  margin: 15px 0;
                  padding: 10px 20px;
                  border-left: 3px solid #ccc;
                  font-style: italic;
                  background-color: #f9f9f9;
                }
                
                /* Tables (if any) */
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 15px 0;
                  page-break-inside: avoid;
                }
                
                th, td {
                  border: 1px solid #333;
                  padding: 8px;
                  text-align: left;
                  font-size: 11px;
                }
                
                th {
                  background-color: #f0f0f0;
                  font-weight: bold;
                }
                
                /* Print-specific styles */
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                    background: white !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                  
                  .no-print {
                    display: none !important;
                  }
                  
                  /* Ensure proper page breaks */
                  h1, h2, h3, h4, h5, h6 {
                    page-break-after: avoid;
                  }
                  
                  p, li {
                    orphans: 3;
                    widows: 3;
                  }
                  
                  .signature-section {
                    page-break-inside: avoid;
                  }
                }
                
                /* Loading and instruction styles */
                .pdf-instructions {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  background: #2563eb;
                  color: white;
                  padding: 15px;
                  text-align: center;
                  font-size: 14px;
                  font-weight: bold;
                  z-index: 1000;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .pdf-content {
                  margin-top: 60px;
                  padding: 20px 0;
                }
                
                @media print {
                  .pdf-instructions {
                    display: none !important;
                  }
                  .pdf-content {
                    margin-top: 0;
                    padding: 0;
                  }
                }
              </style>
            </head>
            <body>
              <div class="pdf-instructions no-print">
                📄 Presione Ctrl+P (Windows) o Cmd+P (Mac) para guardar como PDF
                <div style="margin-top: 5px; font-size: 12px; opacity: 0.9;">
                  En la ventana de impresión, seleccione "Guardar como PDF" como destino
                </div>
              </div>
              
              <div class="pdf-content">
                ${content}
              </div>
              
              <script>
                // Auto-focus the window and show print dialog after content loads
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    window.focus();
                    // Uncomment the next line if you want to auto-trigger print dialog
                    // window.print();
                  }, 500);
                });
                
                // Handle keyboard shortcuts
                document.addEventListener('keydown', function(e) {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                    e.preventDefault();
                    window.print();
                  }
                });
              </script>
            </body>
            </html>
          `);
          printWindow.document.close();
        }
      };

      // Try react-pdf first for automated PDF generation
      try {
        const blob = await pdf(
          <ContractPDF contract={contract} content={content} />
        ).toBlob();

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `contrato-${contractCode}-${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(
          "PDF generated and downloaded successfully using react-pdf!"
        );
        return;
      } catch (pdfError) {
        console.warn("React-PDF failed, using enhanced HTML method:", pdfError);

        // Use enhanced HTML-to-PDF method
        generatePDFFromHTML();
      }

      // Also call the original onDownload for any additional handling
      onDownload(content);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF. Por favor, intente nuevamente.");
      // Final fallback to original download method
      onDownload(editor.getHTML());
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!editor) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Cargando editor...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Editor de Contrato - {contractCode}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? "Editar" : "Vista Previa"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              title="Descargar contrato como PDF con el mismo formato que ve en pantalla"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? "Generando PDF..." : "Descargar PDF"}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              title="Guardar cambios en el contrato"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isPreviewMode && !isReadOnly && (
          <div className="border rounded-lg mb-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                <Button
                  variant={editor.isActive("bold") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive("italic") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive("underline") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive("strike") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Text Alignment */}
              <div className="flex items-center gap-1">
                <Button
                  variant={
                    editor.isActive({ textAlign: "left" }) ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={
                    editor.isActive({ textAlign: "center" })
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={
                    editor.isActive({ textAlign: "right" })
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                  variant={
                    editor.isActive({ textAlign: "justify" })
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Lists */}
              <div className="flex items-center gap-1">
                <Button
                  variant={editor.isActive("bulletList") ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive("orderedList") ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive("blockquote") ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Headings */}
              <div className="flex items-center gap-1">
                <Select
                  value={
                    editor.getAttributes("heading").level?.toString() ||
                    "paragraph"
                  }
                  onValueChange={(value) => {
                    if (value === "paragraph") {
                      editor.chain().focus().setParagraph().run();
                    } else {
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({
                          level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6,
                        })
                        .run();
                    }
                  }}
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraph">Párrafo</SelectItem>
                    <SelectItem value="1">Título 1</SelectItem>
                    <SelectItem value="2">Título 2</SelectItem>
                    <SelectItem value="3">Título 3</SelectItem>
                    <SelectItem value="4">Título 4</SelectItem>
                    <SelectItem value="5">Título 5</SelectItem>
                    <SelectItem value="6">Título 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Font Family */}
              <div className="flex items-center gap-1">
                <Type className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={
                    editor.getAttributes("textStyle").fontFamily || "default"
                  }
                  onValueChange={(value) => {
                    if (value === "default") {
                      editor.chain().focus().unsetFontFamily().run();
                    } else {
                      editor.chain().focus().setFontFamily(value).run();
                    }
                  }}
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Fuente</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Times New Roman">
                      Times New Roman
                    </SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Text Color */}
              <div className="flex items-center gap-1">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <input
                  type="color"
                  value={editor.getAttributes("textStyle").color || "#000000"}
                  onChange={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                  className="w-8 h-8 border rounded cursor-pointer"
                  title="Color del texto"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().unsetColor().run()}
                >
                  Quitar color
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Undo/Redo */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Editor Content */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-white">
            <EditorContent
              editor={editor}
              className="min-h-[600px] max-h-[800px] overflow-y-auto"
            />
          </div>
        </div>

        {isPreviewMode && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Eye className="h-4 w-4" />
              <span className="font-medium">Vista Previa</span>
            </div>
            <p className="text-sm text-blue-600">
              Esta es una vista previa de cómo se verá el contrato. Haz clic en
              &quot;Editar&quot; para volver al modo de edición.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
