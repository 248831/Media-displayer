from lpmn_client import download_file, upload_file
from lpmn_client import Task
import patoolib
import os
import json
import numpy as np
import math
import random
import urllib
import sys

defpath = "./Input/"

outpath = "./media-GUI-main/src/dane.json"

def przetwarzanie(path=defpath):
    # Przetwarzanie
    file_id = upload_file(path)
    t1 = Task("any2txt|fastText({\"model\":\"papall\", \"adv_outlier\":false})")
    t2 = Task("any2txt|wcrft2({\"morfeusz2\":false})|liner2({\"model\":\"n82\"})|geolocation|geo2json")
    output_file_id1 = t1.run(file_id)
    output_file_id2 = t2.run(file_id)
    name1 = download_file(output_file_id1, "./out1")
    name2 = download_file(output_file_id2, "./out2")
    # rozpakowanie
    patoolib.extract_archive(name1, outdir="./out1", verbosity=-1)
    os.remove(name1)
    patoolib.extract_archive(name2, outdir="./out2", verbosity=-1)
    os.remove(name2)


class Node:
    def __init__(self, radius):
        self.mass = radius * 2 * math.pi / 1.5
        self.coords = np.array([random.random() * 12000 - 6000, random.random() * 12000 - 6000])
        self.force = np.array([0, 0])

    def przyloz_sily(self):
        self.coords += self.force / self.mass


def stworzenie_drzewa_obiektow(path=defpath):
    country_list = []
    country_list_backup = []
    cities_list = []

    for filename in os.listdir("./out2"):
        final_filename = os.path.join("./out2", filename)
        with open(final_filename, "r", encoding='utf-8') as read_file:
            data = json.load(read_file)
            correct_filename_ = filename.split('%')[1]
            title = ''
            url = ''
            path_string = path + '/' + correct_filename_
            with open(path_string, "r", encoding='utf-8') as read_file2:
                data2 = json.load(read_file2)
                url = data2['url']
                title = data2['title']
                title = title.replace('"', '\\"')

            for iterator in range(len(data['locations'])):
                if data['locations'][iterator]['type'] == "administrative" or data['locations'][iterator]['type'] == "country":
                    country = data['locations'][iterator]['name'].split(',')
                    # Dodawania panstwa
                    if len(country) == 1:
                        if country[0] not in country_list_backup:
                            country_list.append([country[0].lstrip(), [[country[0], []]]])
                            country_list_backup.append(country[0].lstrip())
                        # DODANIE ARTYKULU DO PANSTWA
                        index = country_list_backup.index(country[0].lstrip())
                        country_list[index][1][0][1].append([filename.split('%')[1], [], title, url])
                    # Dodawanie miasta
                    else:
                        try:
                            index = country_list_backup.index(country[-1].lstrip())
                        except:
                            country_list.append([country[-1].lstrip(), [[country[0], []]]])
                            country_list_backup.append(country[-1].lstrip())
                        index = country_list_backup.index(country[-1].lstrip())
                        # DODANIE MIASTA
                        if country[0] not in cities_list:
                            country_list[index][1].append([country[0], []])
                            cities_list.append(country[0])
                        # DODANIE ARTYKULU DO MIASTA
                        iter2 = 0
                        for city in country_list[index][1]:
                            if country[0] == city[0]:
                                index2 = iter2
                                break
                            iter2 += 1
                        country_list[index][1][index2][1].append([filename.split('%')[1], [], title, url])
    return country_list


def dolaczenie_tematow(country_list):
    for filename in os.listdir("./out1"):
        final_filename = os.path.join("./out1", filename)
        with open(final_filename, "r", encoding='utf-8') as read_file:
            correct_filename = filename.split('%')[1]
            data = json.load(read_file)
            index_country = 0
            for country in country_list:
                index_city = 0
                for city in country[1]:
                    index_file = 0
                    for file in city[1]:
                        if file[0] == correct_filename:
                            country_list[index_country][1][index_city][1][index_file][1].append(data['labels'])
                            country_list[index_country][1][index_city][1][index_file][1].append(data['p'])
                        index_file += 1
                    index_city += 1
                index_country += 1


def spacjoinator(string, length):
    #RRRRRRRR
    return ' '.join(string[i:i+length] for i in range(0, len(string), length))


def jsonoinator(country_list):
    global outpath
    # składanie drzewa obiektów w JSONowy string
    json_string_final = '[\n'
    for country in country_list:
        json_string_final += '\t{\n\t"kraj":"' + country[0] + '",'
        json_string_final += '\n\t"pozycja":"' + country[2] + '",'
        json_string_final += '\n\t"miasta":'
        json_string_final += '\n\t\t[\n'
        for city in country[1]:
            json_string_final += '\t\t{\n\t\t"miasto":"' + city[0] + '",'
            json_string_final += '\n\t\t"pozycja":"' + city[2] + '",'
            json_string_final += '\n\t\t"tematy":'
            json_string_final += '\n\t\t\t[\n'
            for topic in city[1]:
                json_string_final += '\n{ "temat":' + '"' + spacjoinator(topic[0], 9) + '",'
                json_string_final += '\n\t\t\t\t "pozycja":"' + topic[2] + '",'
                json_string_final += '\n\t\t\t\t "art": ['
                for label in list(topic[1]):
                    json_string_final += '\t\t\t\t{"nazwa_pliku":"' + label[0] + '",'
                    json_string_final += '\n\t\t\t\t"url":"' + label[3] + '",'
                    json_string_final += '\n\t\t\t\t"tytul":"' + label[2] + '",'
                    json_string_final += '\n"trafnosc":' + '"' + str(label[1]) + '"},'
                json_string_final = json_string_final[:-1] + "\n"
                json_string_final += '\t\t\t\t ]'
                json_string_final += '\t\t\t\t },'
            json_string_final = json_string_final[:-1] + "\n"
            json_string_final += '\t\t\t]\n'
            json_string_final += '\t\t},'
        json_string_final = json_string_final[:-1] + "\n"
        json_string_final += '\t\t]\n'
        json_string_final += '\t},'
    json_string_final = json_string_final[:-1]
    json_string_final += ']'

    # do debugowania JSONoinatora
    # print(json_string_final)

    # ucywilizowanie stylu JSONa, dump do pliku data.json
    with open(outpath, 'w', encoding='utf-8') as f:
        y = json.loads(json_string_final)
        json.dump(y, f, ensure_ascii=False, indent=4)


def generuj_wspolrzedne_grafu(nodeList, nodeConnections):
    gravityConstant = 0.98
    forceConstant = 5000
    springConstant = 0.005
    loopNumber = 200

    for loop in range(0, loopNumber):
        # przyciaganie grawitacyjne
        for node in nodeList:
            node.force = node.coords * gravityConstant * (-1)
        # odpychanie wezlow od siebie
        for i in range(0, len(nodeList)):
            for j in range(i + 1, len(nodeList)):
                direction = nodeList[j].coords - nodeList[i].coords
                dist = np.linalg.norm(direction)
                force = direction * forceConstant / (dist ** 2)
                nodeList[i].force -= force
                nodeList[j].force += force
        # przyciaganie sprezyste
        for connection in nodeConnections:
            direction = connection[0].coords - connection[1].coords
            dist = np.linalg.norm(direction)
            force = direction * springConstant * 2 * math.log(dist)
            connection[0].force -= force
            connection[1].force += force
        # aplikacja obliczonych sil
        for node in nodeList:
            node.przyloz_sily()


def miasta_tematy_pliki(country_list):
    for country in country_list:
        for city in country[1]:
            # przygotowanie listy tematow
            lista_tematow = []
            lista_temat_trafnosc = []
            for file in city[1]:
                iterator = 0
                for temat in file[1][1]:
                    if temat > 0.1:
                        lista_tematow.append(file[1][0][iterator])
                    iterator += 1
            # przetwarzanie listy tematow
            lista_tematow_set = set(lista_tematow)
            final_city_list = []
            iterator = 0
            for temat in lista_tematow_set:
                final_city_list.append([temat, []])
                for file in city[1]:
                    if temat in file[1][0]:
                        position = file[1][0].index(temat)
                        if file[1][1][position] > 0.1:
                            final_city_list[iterator][1].append([file[0], file[1][1][position], file[2], file[3]])
                iterator += 1
            iterator2 = 0
            for x in final_city_list:
                final_city_list[iterator2][1] = set(map(tuple, x[1]))
                iterator2 += 1
            city[1] = final_city_list
            # wywalenie duplikatów niewiadomego pochodzenia
            if final_city_list == []:
                country[1].remove(city)

def dodaj_wspolrzedne_grafu(country_list):
    lista_wezlow = []
    lista_polaczen = []
    istniejace_tematy = []
    wezel_kraju = None
    wezel_miasta = None
    wezel_tematu = None
    for country in country_list:
        wezel_kraju = Node(5)
        lista_wezlow.append(wezel_kraju)
        istniejace_tematy.append('c')
        for city in country[1]:
            wezel_miasta = Node(3)
            lista_wezlow.append(wezel_miasta)
            lista_polaczen.append([wezel_kraju, wezel_miasta])
            istniejace_tematy.append('t')
            for topic in city[1]:
                if topic[0] in istniejace_tematy:
                    index = istniejace_tematy.index(topic[0])
                    wezel_tematu = lista_wezlow[index]
                    lista_polaczen.append([wezel_miasta, wezel_tematu])
                else:
                    wezel_tematu = Node(2)
                    lista_wezlow.append(wezel_tematu)
                    lista_polaczen.append([wezel_miasta, wezel_tematu])
                    istniejace_tematy.append(topic[0])
    generuj_wspolrzedne_grafu(lista_wezlow, lista_polaczen)
    index = 0
    for country in country_list:
        country.append("[{}, {}]".format(lista_wezlow[index].coords[0], lista_wezlow[index].coords[1]))
        index += 1
        for city in country[1]:
            city.append("[{}, {}]".format(lista_wezlow[index].coords[0], lista_wezlow[index].coords[1]))
            index += 1
            for topic in city[1]:
                if topic[0] in istniejace_tematy:
                    idx = istniejace_tematy.index(topic[0])
                    istniejace_tematy[idx] += '-'
                    topic.append("[{}, {}]".format(lista_wezlow[index].coords[0], lista_wezlow[index].coords[1]))
                    index += 1
                else:
                    idx = istniejace_tematy.index(topic[0] + '-')
                    topic.append("[{}, {}]".format(lista_wezlow[idx].coords[0], lista_wezlow[idx].coords[1]))


def str2bool(v):
    if isinstance(v, bool):
        return v
    if v.lower() in ('yes', 'tak', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'nie', 'false', 'f', 'n', '0'):
        return False
    else:
        print('Boolean value expected.')
        quit()


if __name__ == "__main__":

    print("Rozpoczęcie przetwarzania")

    if (len(sys.argv) != 2):
        print("Zła liczba argumentów")
        print("Oczekiwane użycie: " + sys.argv[0] + " [czy_wywolac_clarin] ")
        quit()   
    czy_wywolac_clarin = str2bool(sys.argv[1])

    if czy_wywolac_clarin:
        przetwarzanie()

    lista_obiektow = stworzenie_drzewa_obiektow()
    dolaczenie_tematow(lista_obiektow)
    miasta_tematy_pliki(lista_obiektow)
    dodaj_wspolrzedne_grafu(lista_obiektow)
    jsonoinator(lista_obiektow)

    print("Zakonczenie przetwarzania")

