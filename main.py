# from typing import Optional

# from fastapi import FastAPI

# app = FastAPI()


# @app.get("/")
# async def root():
#     return {"message": "Hello World"}

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Optional[str] = None):
#     return {"item_id": item_id, "q": q}

from fastapi import FastAPI, HTTPException
import pandas as pd
import numpy as np

app = FastAPI()

@app.post("/calculate_routes/")
async def calculate_routes(demand_file: str, pairwise_file: str, capacity: int = 23):
    try:
        # Read node data in coordinate (x, y) format
        nodes = pd.read_csv(demand_file, index_col='node')
        nodes.rename(columns={"distance to depot": 'd0'}, inplace=True)

        # Read pairwise distance
        pw = pd.read_csv(pairwise_file, index_col='Unnamed: 0')
        pw.index.rename('', inplace=True)

        # Calculate savings for each link
        savings = dict()
        for r in pw.index:
            for c in pw.columns:
                if int(c) != int(r):
                    a = max(int(r), int(c))
                    b = min(int(r), int(c))
                    key = f'({a},{b})'
                    savings[key] = nodes['d0'][int(r)] + nodes['d0'][int(c)] - pw[c][r]

        # Put savings in a pandas DataFrame, and sort by descending
        sv = pd.DataFrame.from_dict(savings, orient='index')
        sv.rename(columns={0: 'saving'}, inplace=True)
        sv.sort_values(by=['saving'], ascending=False, inplace=True)

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

        def sum_cap(route):
            return sum(nodes.demand[node] for node in route)

        def which_route(link, routes):
            node_sel = []
            i_route = [-1, -1]
            count_in = 0
            for route in routes:
                for node in link:
                    if node in route:
                        i_route[count_in] = routes.index(route)
                        node_sel.append(node)
                        count_in += 1
            overlap = i_route[0] == i_route[1]
            return node_sel, count_in, i_route, overlap

        routes = []
        node_list = list(nodes.index)
        node_list.remove(0)

        for link in sv.index:
            link = get_node(link)
            node_sel, num_in, i_route, overlap = which_route(link, routes)

            if num_in == 0:
                if sum_cap(link) <= capacity:
                    routes.append(link)
                    node_list.remove(link[0])
                    node_list.remove(link[1])
            elif num_in == 1:
                n_sel = node_sel[0]
                i_rt = i_route[0]
                position = routes[i_rt].index(n_sel)
                link_temp = link.copy()
                link_temp.remove(n_sel)
                node = link_temp[0]

                if not interior(n_sel, routes[i_rt]) and sum_cap(routes[i_rt] + [node]) <= capacity:
                    if position == 0:
                        routes[i_rt].insert(0, node)
                    else:
                        routes[i_rt].append(node)
                    node_list.remove(node)
            elif not overlap:
                if (not interior(node_sel[0], routes[i_route[0]]) and
                    not interior(node_sel[1], routes[i_route[1]]) and
                    sum_cap(routes[i_route[0]] + routes[i_route[1]]) <= capacity):
                    route_temp = merge(routes[i_route[0]], routes[i_route[1]], node_sel)
                    routes[i_route[0]] = route_temp
                    routes.pop(i_route[1])

        for node_o in node_list:
            routes.append([node_o])

        for route in routes:
            route.insert(0, 0)
            route.append(0)

        return {"routes": routes}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
