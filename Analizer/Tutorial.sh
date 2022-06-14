#!/bin/bash

echo "Aby poprawnie uzyc dockera uruchom go z argumentami -it oraz -d, jak i -p 3000:3000"
echo "Wykonaj Start.sh wewnatrz kontenera w celu re-generacji danych oraz otworzenia serwera"
echo "Dodaj argument -new do Start.h w celu re-analizy plikow (np w przypadku dodania nowych plikow)"
echo "Zamkniecie serwera dostepe jest w skrypcie Stop.sh"
echo "W celu przekazania nowych plikow do analizy wykonaj Clean.sh oraz przekarz pliki z hosta"
echo "Pliki nalerzy przekazac do folderu ./Input"
echo "np. za pomoca docker cp przyklad.txt container_id:/Input/przyklad.txt" 
