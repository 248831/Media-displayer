#!/bin/bash
export NODE_NO_WARNINGS=1
choice="n"


if [ -z "$(ls -A ./Input)" ]; then
	echo "Folder z danymi jest pusty, prosze dodaj dane zgodnie z dokumentacja"
	exit 1
fi


if [ "$#" -eq 1 ] && [ "$1" = "-new" ]; then
echo "jestem"
	rm -rf ./out1
	rm -rf ./out2
	choice="y"
	
python3 skrypt.py $choice & 
pid=$!
	
while [ ! $pid = "" ]; do
  pid=$(ps aux | grep "python3 skrypt.py" | grep -v "grep" | awk -F ' ' '{print $2}')
  echo -n "."
  sleep 1
done 
else
	if [ ! -d "./out1" ] || [ ! -d "./out2" ] || [ -z "$(ls -A ./out1)" ] || [ -z "$(ls -A ./out2)" ] ; then
		echo "Foldery posrednie sa puste, wygeneruj nowe dane (dodaj argument)"
		exit 1
	fi
fi



echo "Tworzenie strony..."
cd ./media-GUI-main
npm run build --silent > /dev/null 2>&1
echo "Inicjalizacja strony..."
serve -s build &
echo "Powodzenie"

read val
