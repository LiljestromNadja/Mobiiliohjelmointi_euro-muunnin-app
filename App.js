import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
//import { API_URL, API_TOKEN } from '@env'; 

//HTTP header named "apikey"
let myHeaders = new Headers();
myHeaders.append("apikey", " API KEY"); 

let requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
}; 


export default function App() {

  const [input, setInput] = useState('');
  const [converted, setConverted] = useState('');
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [selected, setSelected] = useState('');
  

  useEffect(() => {
    fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
      .then(response => response.json())
      .then(result => {
        //console.log(result); 
        setCurrencyCodes(Object.keys(result.symbols));
      })
      .catch(error => console.log('ERROR: ', error));
  }, []);



  const convert = () => {
    let url = `https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${selected}&amount=${input}`; 

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setConverted(parseFloat(data.result).toFixed(2));
          console.log(selected, converted);
        } else {
          Alert.alert('Error', 'Check input! Numeric values only.');
        }
      })
      .catch(error => {
        console.log('ERROR', error);
        Alert.alert('Error', error.message);
      });
  }



  return (
    <View style={styles.container}>      

      <View style={styles.container}>
        <Text style={styles.resultStyle}>
        {input ? `${parseFloat(input).toFixed(2) }` : '0'} {selected ? `${selected}`  : ''} is {converted ? `${converted} €` : '0 €'} 
        </Text>
      </View>

      <View >
        <Image
          style={styles.toCenter}
          source={require('./images/euro.jpg')}        
        />
      </View>
      
      <View>
        <View style={styles.toCenter}>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            placeholder='TYPE HERE... '
            value={input}
            onChangeText={text => setInput(text)}
          />
        </View>

        <Picker             
          selectedValue={selected}
          onValueChange={(itemValue) => setSelected(itemValue)}>
          {
            currencyCodes.map(currencycode => (
              <Picker.Item key={currencycode} label={currencycode} value={currencycode} />
            ))
          }
        </Picker>

      </View>

      <View> 
        <Button title="Convert" onPress={convert} />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 50,
    flex: 1,
    backgroundColor: '#fff',    
    position: 'relative',

  },
  input: {
    fontSize: 15, 
    width: 100,
    height: 39,
    borderWidth: 1,
    textAlign: 'center', 

  },
  resultStyle: {
    alignSelf: 'center',
    paddingTop: 50,
    fontSize: 20,  

  }, 
  toCenter: {
    alignSelf:'center',

  },

});
