import pandas as pd
from fastapi import FastAPI, File, UploadFile,Request
from typing import List
import io
import json

app = FastAPI()

# Function to load data from uploaded JSON files
# def load_data(nodes_file: UploadFile, pw_file: UploadFile):
#     # Read the JSON files
#     nodes_data = pd.read_json(io.StringIO(nodes_file.file.read().decode('utf-8'))).set_index('node')
#     nodes_data.rename(columns={"distance to depot": 'd0'}, inplace=True)
    
#     pw_data = pd.read_json(io.StringIO(pw_file.file.read().decode('utf-8'))).set_index('node')
#     pw_data.index.rename('', inplace=True)
    
#     return nodes_data, pw_data

# Function to calculate savings
def calculate_savings(nodes, pw):
    savings = dict()
    for r in pw.index:
        for c in pw.columns:
            if int(c) != int(r):
                a = max(int(r), int(c))
                b = min(int(r), int(c))
                key = '(' + str(a) + ',' + str(b) + ')'
                savings[key] = nodes['d0'][int(r)] + nodes['d0'][int(c)] - pw[c][r]
    
    sv = pd.DataFrame.from_dict(savings, orient='index')
    sv.rename(columns={0: 'saving'}, inplace=True)
    sv.sort_values(by=['saving'], ascending=False, inplace=True)
    
    return sv

# Helper functions
def get_node(link):
    link = link[1:-1]
    nodes = link.split(',')
    return [int(nodes[0]), int(nodes[1])]

def interior(node, route):
    try:
        i = route.index(node)
        return not (i == 0 or i == len(route) - 1)
    except:
        return False

def merge(route0, route1, link):
    if route0.index(link[0]) != len(route0) - 1:
        route0.reverse()
    if route1.index(link[1]) != 0:
        route1.reverse()
    return route0 + route1

def sum_cap(route, nodes):
    return sum(nodes.demand[node] for node in route)

def which_route(link, routes):
    node_sel, i_route = list(), [-1, -1]
    count_in = 0
    
    for route in routes:
        for node in link:
            try:
                route.index(node)
                i_route[count_in] = routes.index(route)
                node_sel.append(node)
                count_in += 1
            except:
                pass
                
    overlap = 1 if i_route[0] == i_route[1] else 0
    return node_sel, count_in, i_route, overlap

# Main routing function
@app.post("/calculate-routes")
async def calculate_routes(req:Request):
    #nodes, pw = load_data(nodes_file, pw_file)
    data = await req.json()
    nodes=data['node_file']
    pw=data['pw_file']

    nodes=pd.DataFrame(nodes)
    pw=pd.DataFrame(pw)

    sv = calculate_savings(nodes, pw)
    routes = list()
    cap = 23
    node_list = list(nodes.index)
    node_list.remove(0)
    remaining = True

    for link in sv.index:
        if remaining:
            link = get_node(link)
            node_sel, num_in, i_route, overlap = which_route(link, routes)
            if num_in == 0:
                if sum_cap(link, nodes) <= cap:
                    routes.append(link)
                    node_list.remove(link[0])
                    node_list.remove(link[1])
            elif num_in == 1:
                n_sel = node_sel[0]
                i_rt = i_route[0]
                link_temp = link.copy()
                link_temp.remove(n_sel)
                node = link_temp[0]
                if not interior(n_sel, routes[i_rt]) and sum_cap(routes[i_rt] + [node], nodes) <= cap:
                    routes[i_rt].append(node) if routes[i_rt].index(n_sel) != 0 else routes[i_rt].insert(0, node)
                    node_list.remove(node)
            else:
                if overlap == 0:
                    cond1 = not interior(node_sel[0], routes[i_route[0]])
                    cond2 = not interior(node_sel[1], routes[i_route[1]])
                    cond3 = sum_cap(routes[i_route[0]] + routes[i_route[1]], nodes) <= cap
                    if cond1 and cond2 and cond3:
                        route_temp = merge(routes[i_route[0]], routes[i_route[1]], node_sel)
                        routes.remove(routes[i_route[0]])
                        routes.remove(routes[i_route[1]])
                        routes.append(route_temp)
                        node_list = [n for n in node_list if n not in link]
        remaining = bool(len(node_list) > 0)

    for node_o in node_list:
        routes.append([node_o])

    for route in routes:
        route.insert(0, 0)
        route.append(0)

    return {"routes": routes}
