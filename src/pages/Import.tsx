
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Import() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<'select' | 'mapping' | 'validation' | 'import' | 'complete'>('select');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setSelectedFile(file);
      setUploadStep('mapping');
    }
  };

  const mockColumns = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Statut', 'Source'];
  const dbFields = ['nom', 'prenom', 'email', 'telephone', 'statut_lead', 'source'];

  const handleImport = () => {
    setUploadStep('validation');
    // Simulate validation process
    setTimeout(() => {
      setUploadStep('import');
      // Simulate import progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setUploadStep('complete');
        }
      }, 200);
    }, 1500);
  };

  const resetImport = () => {
    setSelectedFile(null);
    setUploadStep('select');
    setUploadProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Import de Données</h1>
          <p className="text-slate-600 mt-1">Importez vos contacts depuis un fichier CSV ou Excel</p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Télécharger le modèle</span>
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Outil d'Import</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Étape 1: Sélection du fichier */}
          {uploadStep === 'select' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Sélectionnez votre fichier
                </h3>
                <p className="text-slate-500 mb-4">
                  Formats acceptés: CSV, Excel (.xlsx)
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="cursor-pointer">
                    Choisir un fichier
                  </Button>
                </label>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Format attendu:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Première ligne: en-têtes de colonnes</li>
                  <li>• Colonnes: Nom, Prénom, Email, Téléphone, Statut, Source</li>
                  <li>• Encoding: UTF-8</li>
                  <li>• Séparateur: virgule (,)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Étape 2: Mapping des colonnes */}
          {uploadStep === 'mapping' && selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Fichier sélectionné: {selectedFile.name}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-4">
                  Associez les colonnes de votre fichier aux champs de la base
                </h3>
                
                <div className="grid gap-4">
                  {mockColumns.map((column, index) => (
                    <div key={column} className="flex items-center space-x-4">
                      <div className="w-32">
                        <Label className="text-sm font-medium">
                          {column}
                        </Label>
                      </div>
                      <div className="flex-1">
                        <Select defaultValue={dbFields[index] || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un champ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Ignorer --</SelectItem>
                            <SelectItem value="nom">Nom</SelectItem>
                            <SelectItem value="prenom">Prénom</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="telephone">Téléphone</SelectItem>
                            <SelectItem value="statut_lead">Statut Lead</SelectItem>
                            <SelectItem value="source">Source</SelectItem>
                            <SelectItem value="notes">Notes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={resetImport}>
                    Annuler
                  </Button>
                  <Button onClick={handleImport}>
                    Valider et Importer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Validation */}
          {uploadStep === 'validation' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-slate-700">
                  Validation des données en cours...
                </h3>
                <p className="text-slate-500">
                  Vérification des formats et détection des doublons
                </p>
              </div>
            </div>
          )}

          {/* Étape 4: Import en cours */}
          {uploadStep === 'import' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">
                  Import en cours...
                </h3>
                <Progress value={uploadProgress} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-slate-500 mt-2">
                  {uploadProgress}% terminé
                </p>
              </div>
            </div>
          )}

          {/* Étape 5: Import terminé */}
          {uploadStep === 'complete' && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Import terminé avec succès!
                </h3>
                <div className="bg-green-50 p-4 rounded-lg max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-green-800">Contacts importés:</span>
                      <p className="text-green-700">127</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-800">Doublons ignorés:</span>
                      <p className="text-green-700">3</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mt-6">
                  <Button onClick={resetImport}>
                    Nouvel import
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/contacts'}>
                    Voir les contacts
                  </Button>
                </div>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
