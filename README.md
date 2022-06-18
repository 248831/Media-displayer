Narzędzie do analizy powiązań lokacji oraz tematyki w zbiorze tekstów.

Proszę odnieść się do dokumentacji lub skróconej instrukcji obsługi:

Docker: 
- stworzyć kontener z udostępnionego dockerfile
- uruchomić kontener jako daemon (argumentem -d) oraz z przekierowaniem portu 3000 na dowolny zewnętrzny port (np. -p 3000:3000)
- przekazać dane do analizy do folderu Input kontenera
- uruchomić skrypt Start.sh z argumentem -new (jako dodatkowy argument dockera warto użyć -it) wewnątrz kontenera
- po otrzymaniu wiadomości o pomyślnym tworzeniu strony otworzyć przeglądarkę internetową, jako adresu użyć localhost:<numer wybranego portu>

Linux:
- upewnić się że posiadamy wszystkie niezbędne zależności, które są instalowane dla kontenera (pakiety nazwane w pliku dockerfile oraz biblioteki pythona z pliku requirements.txt)
- umieścić pliki przeznaczone do analizy w folderze Input
- uruchomić Start.sh z argumentem -new
- strona z wynikami powinna uruchomić się samoistnie lub jej adres powinien zostać wyświetlony w terminalu, z którego wykonano skrypt

Windows: 
- zainstalować wymagane oprogramowanie (python, nmp, pip, biblioteki pythona)
- uruchomić skrypt skrypt.ph z argumentem y
- uruchomić serwer npm dla strony w podfolderze media – GUI – main
- wyświetlić stronę serwera

Dodatkowe porady (Linux/Docker):
- Clean.sh czyści folder wejściowy 
- Stop.sh wymusza zamknięcie serwera
- Tutorial.sh wyświetla skróconą instrukcję obsługi 

Po uruchomieniu skryptu na lokalnym porcie 3000 można wejść do menu wyboru reprezentacji.
Po wybraniu reprezentację można zmienić klikając w przycisk w leywm górnym rogu ekranu.
  
Możliwe są dwie reprezentacje

Tabela:

* Wyświetla dane w postaci mapy ciepła, kodując procent ważności miejsca dla tematu przechodząc między barwami: biały: 0%, zielony: 33%, żółty: 66%, czerwony: 100%
* Najeżdżając na komórki tabeli można zobaczyć jakie artykuły odnoszą się do danego tematu i miejsca
* Najeżdżając na górę strony można przełączać między krajami a miastami

Mapa myśli:

* Wyświetla dane łącząc węzły reprezentujące tematy z węzłami odpowiadającymi miejscom, wspomnianych w artykułach
* Najeżdżając na górę strony można przełączać między krajami a miastami, ale można też (domyślnie) pozwalać programowi decydować o reprezentacji
* Najeżdżając na dany węzeł grafu można zobaczyć do jakiego miejsca/tematu się on odnosi
* Najeżdżając na krawędź pomiędzy węzłami można zobaczyć jakie artykuły się do nich odnoszą
* Lewy przycisk myszy pozwala nam przewijać zawartość mapy, kółko myszki pozwala nam przybliżać i oddalać
