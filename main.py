import pandas as pd
from fastapi import FastAPI, Request
import aiohttp
import asyncio
import geopy.distance
from pyzipcode import ZipCodeDatabase
import osmnx as ox
import networkx as nx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=False,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

async def get_coordinates(session, zip_code):
    zcdb = ZipCodeDatabase()
    zipcode = zcdb[zip_code]
    return zipcode.latitude , zipcode.longitude

async def get_distance(session, start, end):
    return geopy.distance.distance(start, end).km

async def calculate_distance_matrix(input_data):
    # Retrieve the original list of nodes
    original_nodes = input_data["node_file"]["node"]

    # Start creating a list of indices for these nodes
    nodes = list(range(len(original_nodes)))


    async with aiohttp.ClientSession() as session:
        depotCoordinates = await get_coordinates(session, str(original_nodes[0]))
        # graph = ox.graph_from_point(depotCoordinates, dist=8000, network_type='drive')

        # Get coordinates for all nodes
        tasks = [get_coordinates(session, str(zip_code)) for zip_code in original_nodes]
        coordinates = await asyncio.gather(*tasks)
        # print(coordinates)
        # Calculate distances between all nodes
        distances = []
        for i, start in enumerate(coordinates):
            row = []
            for j, end in enumerate(coordinates):
                if i == j:
                    row.append(0)
                else:
                    distance = await get_distance(session, start, end)
                    # if distance<8:
                        # print(start)
                        # print(end)
                        # node_1 = ox.distance.nearest_nodes(graph, start[1], start[0])
                        # node_2 = ox.distance.nearest_nodes(graph, end[1], end[0])
                        # distance = nx.shortest_path_length(graph, node_1, node_2, weight='length')/1000
                    row.append(distance if distance is not None else float('inf'))
            distances.append(row)

    # Create a DataFrame with indices and columns starting from 0
    pw = pd.DataFrame(distances, index=nodes, columns=nodes)
    # print(pw)
    return pw

# Function to calculate savings
def calculate_savings(nodes, pw):
    savings = dict()
    for r in pw.index:
        for c in pw.columns:
            if int(c) != int(r) and r > 0 and c > 0:
                a = max(int(r), int(c))
                b = min(int(r), int(c))
                key = '(' + str(a) + ',' + str(b) + ')'
                savings[key] = nodes['d0'][int(r)] + nodes['d0'][int(c)] - pw[c][r]
                # savings[key] = pw[0][int(r)] + pw[0][int(c)] - pw[c][r]
    
    sv = pd.DataFrame.from_dict(savings, orient='index')
    sv.rename(columns={0: 'saving'}, inplace=True)
    sv.sort_values(by=['saving'], ascending=False, inplace=True)
    
    return sv

# Helper functions
def get_node(link):
    link = link[1:]
    link = link[:-1]
    nodes = link.split(',')
    return [int(nodes[0]), int(nodes[1])]

def interior(node, route):
    try:
        i = route.index(node)
        if i == 0 or i == (len(route) - 1):
            label = False
        else:
            label = True
    except:
        label = False
    
    return label

def merge(route0, route1, link):
    if route0.index(link[0]) != (len(route0) - 1):
        route0.reverse()
    
    if route1.index(link[1]) != 0:
        route1.reverse()
        
    return route0 + route1

def sum_cap(route,nodes):
    sum_cap = 0
    for node in route:
        sum_cap += nodes.demand[node]
    return sum_cap

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
async def calculate_routes(req: Request):
    data = await req.json()
    nodes = data['node_file']
    
    # Calculate the distance matrix asynchronously
    pw = await calculate_distance_matrix(data)
    noOfNodes = len(data["node_file"]["node"])

    #Base case
    if(noOfNodes == 2):
        return {"routes": [[0, 1, 0]]}
    

    data["node_file"]["node"] = list(range(noOfNodes))
    nodes['d0'] = pw.iloc[0].values
    nodes = pd.DataFrame(nodes)
    sv = calculate_savings(nodes, pw)


    routes = list()
    remaining = True
    cap = data["cap"]
    step = 0
    node_list = list(nodes.index)
    node_list.remove(0)
    for link in sv.index:
        step += 1
        if remaining:
            # print('step ', step, ':')

            link = get_node(link)
            node_sel, num_in, i_route, overlap = which_route(link, routes)

            if num_in == 0:
                if sum_cap(link,nodes) <= cap:
                    routes.append(link)
                    node_list.remove(link[0])
                    node_list.remove(link[1])
                    # print('\t','Link ', link, ' fulfills criteria a), so it is created as a new route')
                # else:
                    # print('\t','Though Link ', link, ' fulfills criteria a), it exceeds maximum load, so skip this link.')

            elif num_in == 1:
                n_sel = node_sel[0]
                i_rt = i_route[0]
                position = routes[i_rt].index(n_sel)
                link_temp = link.copy()
                link_temp.remove(n_sel)
                node = link_temp[0]

                cond1 = (not interior(n_sel, routes[i_rt]))
                cond2 = (sum_cap(routes[i_rt] + [node],nodes) <= cap)

                if cond1:
                    if cond2:
                        # print('\t','Link ', link, ' fulfills criteria b), so a new node is added to route ', routes[i_rt], '.')
                        if position == 0:
                            routes[i_rt].insert(0, node)
                        else:
                            routes[i_rt].append(node)
                        node_list.remove(node)
                    else:
                        # print('\t','Though Link ', link, ' fulfills criteria b), it exceeds maximum load, so skip this link.')
                        continue
                else:
                    # print('\t','For Link ', link, ', node ', n_sel, ' is interior to route ', routes[i_rt], ', so skip this link')
                    continue

            else:
                if overlap == 0:
                    cond1 = (not interior(node_sel[0], routes[i_route[0]]))
                    cond2 = (not interior(node_sel[1], routes[i_route[1]]))
                    cond3 = (sum_cap(routes[i_route[0]] + routes[i_route[1]],nodes) <= cap)

                    if cond1 and cond2:
                        if cond3:
                            route_temp = merge(routes[i_route[0]], routes[i_route[1]], node_sel)
                            temp1 = routes[i_route[0]]
                            temp2 = routes[i_route[1]]
                            routes.append(route_temp)
                            routes.remove(temp1)
                            routes.remove(temp2)
                            try:
                                node_list.remove(link[0])
                                node_list.remove(link[1])
                            except:
                                pass
                            # print('\t','Link ', link, ' fulfills criteria c), so route ', temp1, ' and route ', temp2, ' are merged')
                        else:
                            # print('\t','Though Link ', link, ' fulfills criteria c), it exceeds maximum load, so skip this link.')
                            continue
                    else:
                        # print('\t','For link ', link, ', Two nodes are found in two different routes, but not all the nodes fulfill interior requirement, so skip this link')
                        continue
                else:
                    # print('\t','Link ', link, ' is already included in the routes')
                    continue

            # for route in routes: 
                # print('\t','route: ', route, ' with load ', sum_cap(route))
        else:
            # print('-------')
            # print('All nodes are included in the routes, algorithm closed')
            break

        remaining = bool(len(node_list) > 0)

    for node_o in node_list:
        routes.append([node_o])

    for route in routes:
        route.insert(0,0)
        route.append(0)

    return {"routes": routes}
