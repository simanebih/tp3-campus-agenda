import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Categorie = 'Atelier' | 'Conférence' | 'Rencontre';

type Evenement = {
  id: string;
  titre: string;
  categorie: Categorie;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React',   categorie: 'Atelier',    capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA',   categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier',    capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI',       categorie: 'Atelier',    capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets',   categorie: 'Rencontre',  capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git',  categorie: 'Atelier',    capacite: 24, inscrits: 24 },
];

// ===== ÉTAPE 2 : fonctions de gestion =====
type Statut = 'Complet' | 'Presque complet' | 'Ouvert';

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): Statut {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r <= 3) return 'Presque complet';
  return 'Ouvert';
}
// ===== ÉTAPE 3 : indicateurs =====
const totalEvenements = evenements.length;
const nbComplets = evenements.filter((e) => placesRestantes(e) === 0).length;
const nbAvecPlaces = evenements.filter((e) => placesRestantes(e) > 0).length;
const totalPlaces = evenements.reduce((somme, e) => somme + placesRestantes(e), 0);
const ateliersDisponibles = evenements.filter(
  (e) => e.categorie === 'Atelier' && placesRestantes(e) > 0
);
// ===== ÉTAPE 4 : composant BadgeEtat =====
const couleursStatut: Record<Statut, { fond: string; texte: string }> = {
  'Complet':         { fond: '#FEE2E2', texte: '#991B1B' },
  'Presque complet': { fond: '#FFEDD5', texte: '#9A3412' },
  'Ouvert':          { fond: '#DCFCE7', texte: '#166534' },
};

type BadgeEtatProps = {
  statut: Statut;
};

function BadgeEtat({ statut }: BadgeEtatProps) {
  const couleurs = couleursStatut[statut];
  return (
    <View style={[styles.badge, { backgroundColor: couleurs.fond }]}>
      <Text style={[styles.badgeTexte, { color: couleurs.texte }]}>{statut}</Text>
    </View>
  );
}
// ===== ÉTAPE 5 : composant BlocStatistique =====
type BlocStatistiqueProps = {
  libelle: string;
  valeur: number;
};

function BlocStatistique({ libelle, valeur }: BlocStatistiqueProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.blocValeur}>{valeur}</Text>
      <Text style={styles.blocLibelle}>{libelle}</Text>
    </View>
  );
}
// ===== ÉTAPE 6 : composant CarteEvenement =====
type CarteEvenementProps = {
  evenement: Evenement;
};

function CarteEvenement({ evenement }: CarteEvenementProps) {
  const r = placesRestantes(evenement);
  const texteLibres =
    r === 0 ? 'Aucune place libre' : r === 1 ? '1 place libre' : `${r} places libres`;

  return (
    <View style={styles.carte}>
      <View style={styles.carteInfos}>
        <Text style={styles.carteTitre}>{evenement.titre}</Text>
        <Text style={styles.carteCategorie}>{evenement.categorie}</Text>
        <Text style={styles.cartePlaces}>{texteLibres}</Text>
      </View>
      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}
// ===== ÉTAPE 8 : mode d'affichage =====
type Mode = 'tous' | 'ateliers';

// Changer cette valeur ('tous' ou 'ateliers') pour changer l'affichage
   const mode = 'tous' as Mode;

const evenementsAffiches: Evenement[] =
  mode === 'tous' ? evenements : ateliersDisponibles;

const titreMode =
  mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles';
 export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.entete}>
        <Text style={styles.enteteTitre}>CampusAgenda</Text>
      </View>
      <Text style={styles.sousTitre}>Événements du campus</Text>

      <View style={styles.rangeeStats}>
        <BlocStatistique libelle="Événements" valeur={totalEvenements} />
        <BlocStatistique libelle="Complets" valeur={nbComplets} />
        <BlocStatistique libelle="Avec places" valeur={nbAvecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={totalPlaces} />
      </View>

      <Text style={styles.titreMode}>{titreMode}</Text>

      <FlatList
        data={evenementsAffiches}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.videTexte}>
            Aucun événement à afficher pour le moment.
          </Text>
        }
        contentContainerStyle={styles.liste}
      />
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 56,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeTexte: {
    fontSize: 12,
    fontWeight: '700',
  },
  rangeeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
    paddingHorizontal: 16,
  },
  bloc: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  blocValeur: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B2A6B',
  },
  blocLibelle: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
  },
    liste: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  carteInfos: {
    flex: 1,
  },
  carteTitre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2A6B',
  },
  carteCategorie: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cartePlaces: {
    fontSize: 13,
    color: '#1D4ED8',
    marginTop: 4,
  },
  entete: {
    backgroundColor: '#0B3D91',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  enteteTitre: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  sousTitre: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    marginVertical: 10,
  },
    titreMode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2A6B',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  videTexte: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    padding: 24,
  },
});