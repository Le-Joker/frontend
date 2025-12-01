import { useState, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Save
} from 'lucide-react';

export default function WYSIWYGEditor() {
  const [content, setContent] = useState('');
  const [selection, setSelection] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    // Charger le contenu initial si édition
    const savedContent = '<p>Commencez à rédiger votre leçon ici...</p>';
    if (editorRef.current) {
      editorRef.current.innerHTML = savedContent;
    }
  }, []);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Entrez l\'URL du lien:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Entrez l\'URL de l\'image:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleSave = () => {
    const htmlContent = editorRef.current?.innerHTML || '';
    console.log('Contenu sauvegardé:', htmlContent);
    // Envoyer au backend via API
    alert('Leçon sauvegardée avec succès !');
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Gras' },
    { icon: Italic, command: 'italic', title: 'Italique' },
    { icon: Underline, command: 'underline', title: 'Souligné' },
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Titre 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Titre 2' },
    { icon: List, command: 'insertUnorderedList', title: 'Liste à puces' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Liste numérotée' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Aligner à gauche' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Centrer' },
    { icon: AlignRight, command: 'justifyRight', title: 'Aligner à droite' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Citation' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code' },
    { icon: Undo, command: 'undo', title: 'Annuler' },
    { icon: Redo, command: 'redo', title: 'Refaire' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Éditeur de Leçon</h2>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Save className="h-4 w-4" />
            Sauvegarder
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-1">
          {toolbarButtons.map((btn, index) => (
            <button
              key={index}
              onClick={() => btn.value ? execCommand(btn.command, btn.value) : execCommand(btn.command)}
              title={btn.title}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
            >
              <btn.icon className="h-4 w-4 text-gray-700" />
            </button>
          ))}
          
          <div className="h-6 w-px bg-gray-300 mx-1" />
          
          <button
            onClick={insertLink}
            title="Insérer un lien"
            className="p-2 hover:bg-gray-200 rounded transition-colors"
          >
            <Link className="h-4 w-4 text-gray-700" />
          </button>
          
          <button
            onClick={insertImage}
            title="Insérer une image"
            className="p-2 hover:bg-gray-200 rounded transition-colors"
          >
            <Image className="h-4 w-4 text-gray-700" />
          </button>

          <div className="h-6 w-px bg-gray-300 mx-1" />

          <select
            onChange={(e) => execCommand('fontSize', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
            defaultValue="3"
          >
            <option value="1">Très petit</option>
            <option value="2">Petit</option>
            <option value="3">Normal</option>
            <option value="4">Grand</option>
            <option value="5">Très grand</option>
          </select>

          <input
            type="color"
            onChange={(e) => execCommand('foreColor', e.target.value)}
            className="ml-2 h-8 w-12 border border-gray-300 rounded cursor-pointer"
            title="Couleur du texte"
          />
        </div>

        {/* Éditeur */}
        <div className="p-6">
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[500px] p-6 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 prose max-w-none"
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
            }}
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
          />
        </div>

        {/* Footer avec statistiques */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-600">
          <div className="flex gap-6">
            <span>Mots: {editorRef.current?.innerText.split(/\s+/).filter(w => w).length || 0}</span>
            <span>Caractères: {editorRef.current?.innerText.length || 0}</span>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 hover:bg-gray-200 rounded">Aperçu</button>
            <button className="px-3 py-1 hover:bg-gray-200 rounded">Code source</button>
          </div>
        </div>
      </div>

      {/* Guide d'utilisation */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Conseils de rédaction</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Utilisez des titres pour structurer votre contenu</li>
          <li>• Ajoutez des images pour illustrer vos propos</li>
          <li>• Utilisez des listes pour les étapes ou les points clés</li>
          <li>• Mettez en gras les concepts importants</li>
          <li>• Utilisez des citations pour les définitions</li>
        </ul>
      </div>

      {/* Templates prédéfinis */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📝 Templates de leçon</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.innerHTML = `
                  <h1>Introduction</h1>
                  <p>Brève introduction au sujet...</p>
                  
                  <h2>Objectifs</h2>
                  <ul>
                    <li>Objectif 1</li>
                    <li>Objectif 2</li>
                    <li>Objectif 3</li>
                  </ul>
                  
                  <h2>Contenu principal</h2>
                  <p>Développez votre leçon ici...</p>
                  
                  <h2>Points clés à retenir</h2>
                  <ul>
                    <li>Point 1</li>
                    <li>Point 2</li>
                  </ul>
                `;
              }
            }}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 transition-colors text-left"
          >
            <p className="font-medium text-gray-900">Leçon Standard</p>
            <p className="text-sm text-gray-600 mt-1">Structure classique avec intro, objectifs, contenu</p>
          </button>

          <button
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.innerHTML = `
                  <h1>Tutoriel Pratique</h1>
                  
                  <h2>Matériel nécessaire</h2>
                  <ul>
                    <li>Outil 1</li>
                    <li>Outil 2</li>
                  </ul>
                  
                  <h2>Étapes</h2>
                  <h3>Étape 1</h3>
                  <p>Description...</p>
                  
                  <h3>Étape 2</h3>
                  <p>Description...</p>
                  
                  <h2>Résultat final</h2>
                  <p>Ce que vous devez obtenir...</p>
                `;
              }
            }}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 transition-colors text-left"
          >
            <p className="font-medium text-gray-900">Tutoriel Pratique</p>
            <p className="text-sm text-gray-600 mt-1">Format étape par étape avec matériel</p>
          </button>

          <button
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.innerHTML = `
                  <h1>Concept Théorique</h1>
                  
                  <blockquote>
                    <p>Définition clé du concept...</p>
                  </blockquote>
                  
                  <h2>Explication</h2>
                  <p>Développement théorique...</p>
                  
                  <h2>Exemples</h2>
                  <p>Exemple 1...</p>
                  
                  <h2>Applications</h2>
                  <p>Où utiliser ce concept...</p>
                `;
              }
            }}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 transition-colors text-left"
          >
            <p className="font-medium text-gray-900">Concept Théorique</p>
            <p className="text-sm text-gray-600 mt-1">Pour les leçons de théorie et définitions</p>
          </button>
        </div>
      </div>
    </div>
  );
}