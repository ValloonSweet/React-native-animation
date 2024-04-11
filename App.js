import { StyleSheet, View } from 'react-native';
import Deck from './src/Deck';

const DATA = [
  { id: 1, text: 'Card #1', uri: 'https://media.enomy.com/item_images/d5ca61573281384979.jpg' },
  { id: 2, text: 'Card #2', uri: 'https://media.enomy.com/item_images/e8bc91573285741527.jpg' },
  { id: 3, text: 'Card #3', uri: 'https://media.enomy.com/item_images/164b71573299709875.jpg' },
  { id: 4, text: 'Card #4', uri: 'https://media.enomy.com/item_images/8262d1573301984700.jpg' },
];

export default function App() {

  return (
    <View style={styles.container}>
      <Deck
        data={DATA}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
