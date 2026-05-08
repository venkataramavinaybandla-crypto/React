import java.util.*;

public class Backend {

    // ===================== MODELS =====================

    static class Flight {
        String flightId;
        String origin;
        String destination;
        String captainName;
        int departureTime;
        int delay;
        int passengers;
        int passengerCapacity;
        double cost;

        Flight(String id, String o, String d, String captain,
               int dep, int delay, int pax, int cap, double cost) {
            this.flightId = id;
            this.origin = o;
            this.destination = d;
            this.captainName = captain;
            this.departureTime = dep;
            this.delay = delay;
            this.passengers = pax;
            this.passengerCapacity = cap;
            this.cost = cost;
        }

        @Override
        public String toString() {
            return "Flight ID: " + flightId +
                    " | Route: " + origin + " -> " + destination +
                    " | Captain: " + captainName +
                    " | Departure: " + departureTime +
                    " | Delay: " + delay + " min" +
                    " | Onboard: " + passengers + "/" + passengerCapacity +
                    " | Avg Ticket: $" + cost;
        }
    }

    static class Passenger {
        String passengerId;
        String name;
        String flightId;
        int ticketNumber;

        Passenger(String pid, String name, String fid, int ticket) {
            this.passengerId = pid;
            this.name = name;
            this.flightId = fid;
            this.ticketNumber = ticket;
        }
    }

    static class CargoItem {
        String name;
        int weight;
        double value;

        CargoItem(String name, int w, double v) {
            this.name = name;
            this.weight = w;
            this.value = v;
        }

        @Override
        public String toString() {
            return name + " [weight=" + weight + "kg, value=$" + value + "]";
        }
    }

    // ===================== M1: BST & AVL =====================

    static class BSTNode {
        Flight flight;
        BSTNode left, right;

        BSTNode(Flight f) {
            flight = f;
        }
    }

    static class FlightBST {
        BSTNode root;

        BSTNode insert(BSTNode node, Flight f) {
            if (node == null) return new BSTNode(f);
            int cmp = f.flightId.compareTo(node.flight.flightId);
            if (cmp < 0) node.left = insert(node.left, f);
            else if (cmp > 0) node.right = insert(node.right, f);
            return node;
        }

        void insert(Flight f) {
            root = insert(root, f);
        }

        Flight search(BSTNode node, String id) {
            if (node == null) return null;
            int cmp = id.compareTo(node.flight.flightId);
            if (cmp == 0) return node.flight;
            return (cmp < 0) ? search(node.left, id) : search(node.right, id);
        }

        Flight search(String id) {
            return search(root, id);
        }

        void inorder(BSTNode node, List<Flight> result) {
            if (node == null) return;
            inorder(node.left, result);
            result.add(node.flight);
            inorder(node.right, result);
        }

        List<Flight> getSortedFlights() {
            List<Flight> res = new ArrayList<>();
            inorder(root, res);
            return res;
        }
    }

    static class AVLNode {
        Flight flight;
        AVLNode left, right;
        int height;

        AVLNode(Flight f) {
            flight = f;
            height = 1;
        }
    }

    static class AVLTree {
        AVLNode root;

        int height(AVLNode n) {
            return (n == null) ? 0 : n.height;
        }

        int balance(AVLNode n) {
            return (n == null) ? 0 : height(n.left) - height(n.right);
        }

        AVLNode rotateRight(AVLNode y) {
            AVLNode x = y.left;
            AVLNode t = x.right;
            x.right = y;
            y.left = t;
            y.height = Math.max(height(y.left), height(y.right)) + 1;
            x.height = Math.max(height(x.left), height(x.right)) + 1;
            return x;
        }

        AVLNode rotateLeft(AVLNode x) {
            AVLNode y = x.right;
            AVLNode t = y.left;
            y.left = x;
            x.right = t;
            x.height = Math.max(height(x.left), height(x.right)) + 1;
            y.height = Math.max(height(y.left), height(y.right)) + 1;
            return y;
        }

        AVLNode insert(AVLNode node, Flight f) {
            if (node == null) return new AVLNode(f);

            int cmp = f.flightId.compareTo(node.flight.flightId);
            if (cmp < 0) {
                node.left = insert(node.left, f);
            } else if (cmp > 0) {
                node.right = insert(node.right, f);
            } else {
                return node;
            }

            node.height = Math.max(height(node.left), height(node.right)) + 1;
            int bal = balance(node);

            if (bal > 1 && f.flightId.compareTo(node.left.flight.flightId) < 0) {
                return rotateRight(node);
            }
            if (bal < -1 && f.flightId.compareTo(node.right.flight.flightId) > 0) {
                return rotateLeft(node);
            }
            if (bal > 1 && f.flightId.compareTo(node.left.flight.flightId) > 0) {
                node.left = rotateLeft(node.left);
                return rotateRight(node);
            }
            if (bal < -1 && f.flightId.compareTo(node.right.flight.flightId) < 0) {
                node.right = rotateRight(node.right);
                return rotateLeft(node);
            }
            return node;
        }

        void insert(Flight f) {
            root = insert(root, f);
        }

        void inorder(AVLNode node, List<Flight> res) {
            if (node == null) return;
            inorder(node.left, res);
            res.add(node.flight);
            inorder(node.right, res);
        }

        List<Flight> getSortedFlights() {
            List<Flight> res = new ArrayList<>();
            inorder(root, res);
            return res;
        }
    }

    // ===================== M2: B+Tree, Segment Tree, Fenwick =====================

    static class BPlusTree {
        static final int ORDER = 4; // placeholder for real splits

        static class BPNode {
            List<Integer> keys = new ArrayList<>();
            List<List<Flight>> data = new ArrayList<>();
            List<BPNode> children = new ArrayList<>();
            BPNode next;
            boolean isLeaf;

            BPNode(boolean leaf) {
                isLeaf = leaf;
            }
        }

        BPNode root = new BPNode(true);

        void insert(Flight f) {
            insertIntoLeaf(root, f.departureTime, f);
        }

        private void insertIntoLeaf(BPNode node, int key, Flight f) {
            if (!node.isLeaf) return;
            int i = 0;
            while (i < node.keys.size() && node.keys.get(i) < key) {
                i++;
            }
            if (i < node.keys.size() && node.keys.get(i) == key) {
                node.data.get(i).add(f);
            } else {
                node.keys.add(i, key);
                List<Flight> bucket = new ArrayList<>();
                bucket.add(f);
                node.data.add(i, bucket);
            }
        }

        List<Flight> rangeQuery(int lo, int hi) {
            List<Flight> res = new ArrayList<>();
            for (int i = 0; i < root.keys.size(); i++) {
                int key = root.keys.get(i);
                if (key >= lo && key <= hi) {
                    res.addAll(root.data.get(i));
                }
            }
            return res;
        }
    }

    static class SegmentTree {
        int[] tree;
        int n;

        SegmentTree(int[] arr) {
            n = arr.length;
            tree = new int[4 * n];
            build(arr, 0, 0, n - 1);
        }

        void build(int[] arr, int node, int start, int end) {
            if (start == end) {
                tree[node] = arr[start];
                return;
            }
            int mid = (start + end) / 2;
            build(arr, 2 * node + 1, start, mid);
            build(arr, 2 * node + 2, mid + 1, end);
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        int query(int node, int start, int end, int left, int right) {
            if (right < start || end < left) {
                return 0;
            }
            if (left <= start && end <= right) {
                return tree[node];
            }
            int mid = (start + end) / 2;
            int q1 = query(2 * node + 1, start, mid, left, right);
            int q2 = query(2 * node + 2, mid + 1, end, left, right);
            return q1 + q2;
        }

        int query(int left, int right) {
            return query(0, 0, n - 1, left, right);
        }
    }

    static class FenwickTree {
        int[] bit;
        int n;

        FenwickTree(int n) {
            this.n = n;
            bit = new int[n + 1];
        }

        void update(int index, int delta) {
            int i = index + 1;
            while (i <= n) {
                bit[i] += delta;
                i += i & (-i);
            }
        }

        int queryPrefix(int index) {
            int sum = 0;
            int i = index + 1;
            while (i > 0) {
                sum += bit[i];
                i -= i & (-i);
            }
            return sum;
        }

        int rangeQuery(int left, int right) {
            if (right < left) return 0;
            int rightSum = queryPrefix(right);
            int leftSum = (left > 0) ? queryPrefix(left - 1) : 0;
            return rightSum - leftSum;
        }
    }

    // ===================== M3: Graph – BFS, DFS, MST =====================

    static class AirportGraph {

        static class Edge {
            String to;
            int weight;

            Edge(String to, int weight) {
                this.to = to;
                this.weight = weight;
            }
        }

        Map<String, List<Edge>> adjacency = new HashMap<>();

        void addAirport(String code) {
            adjacency.putIfAbsent(code, new ArrayList<>());
        }

        void addRoute(String from, String to, int weight) {
            addAirport(from);
            addAirport(to);
            adjacency.get(from).add(new Edge(to, weight));
            adjacency.get(to).add(new Edge(from, weight));
        }

        List<String> bfs(String start) {
            List<String> order = new ArrayList<>();
            if (!adjacency.containsKey(start)) return order;
            Queue<String> q = new LinkedList<>();
            Set<String> visited = new HashSet<>();
            q.add(start);
            visited.add(start);
            while (!q.isEmpty()) {
                String cur = q.poll();
                order.add(cur);
                for (Edge e : adjacency.getOrDefault(cur, Collections.emptyList())) {
                    if (!visited.contains(e.to)) {
                        visited.add(e.to);
                        q.add(e.to);
                    }
                }
            }
            return order;
        }

        List<String> dfs(String start) {
            List<String> order = new ArrayList<>();
            dfsHelper(start, new HashSet<>(), order);
            return order;
        }

        private void dfsHelper(String node, Set<String> visited, List<String> order) {
            if (visited.contains(node) || !adjacency.containsKey(node)) return;
            visited.add(node);
            order.add(node);
            for (Edge e : adjacency.getOrDefault(node, Collections.emptyList())) {
                if (!visited.contains(e.to)) {
                    dfsHelper(e.to, visited, order);
                }
            }
        }

        List<String[]> kruskalMST() {
            List<String[]> edges = new ArrayList<>();
            Set<String> unique = new HashSet<>();
            for (Map.Entry<String, List<Edge>> entry : adjacency.entrySet()) {
                String u = entry.getKey();
                for (Edge e : entry.getValue()) {
                    String v = e.to;
                    String key = (u.compareTo(v) < 0) ? u + "-" + v : v + "-" + u;
                    if (!unique.contains(key)) {
                        unique.add(key);
                        edges.add(new String[]{u, v, String.valueOf(e.weight)});
                    }
                }
            }

            edges.sort(Comparator.comparingInt(a -> Integer.parseInt(a[2])));

            Map<String, String> parent = new HashMap<>();
            for (String node : adjacency.keySet()) parent.put(node, node);

            List<String[]> mst = new ArrayList<>();
            for (String[] e : edges) {
                String ru = find(parent, e[0]);
                String rv = find(parent, e[1]);
                if (!ru.equals(rv)) {
                    parent.put(ru, rv);
                    mst.add(e);
                }
            }
            return mst;
        }

        private String find(Map<String, String> parent, String x) {
            String p = parent.get(x);
            if (!p.equals(x)) {
                parent.put(x, find(parent, p));
            }
            return parent.get(x);
        }
    }

    // ===================== M4: Shortest Paths & Topological Sort =====================

    static class ShortestPath {

        static Map<String, Double> dijkstra(Map<String, List<String[]>> graph, String src) {
            Map<String, Double> dist = new HashMap<>();
            for (String node : graph.keySet()) {
                dist.put(node, Double.MAX_VALUE);
            }
            dist.put(src, 0.0);

            PriorityQueue<String[]> pq =
                    new PriorityQueue<>(Comparator.comparingDouble(a -> Double.parseDouble(a[1])));
            pq.offer(new String[]{src, "0.0"});

            while (!pq.isEmpty()) {
                String[] cur = pq.poll();
                String u = cur[0];
                double d = Double.parseDouble(cur[1]);
                if (d > dist.get(u)) continue;
                for (String[] nb : graph.getOrDefault(u, Collections.emptyList())) {
                    String v = nb[0];
                    double w = Double.parseDouble(nb[1]);
                    double nd = d + w;
                    if (nd < dist.getOrDefault(v, Double.MAX_VALUE)) {
                        dist.put(v, nd);
                        pq.offer(new String[]{v, String.valueOf(nd)});
                    }
                }
            }
            return dist;
        }

        static Map<String, Double> bellmanFord(Map<String, List<String[]>> graph,
                                               String src,
                                               List<String> nodes) {
            Map<String, Double> dist = new HashMap<>();
            for (String n : nodes) dist.put(n, Double.MAX_VALUE);
            dist.put(src, 0.0);

            for (int i = 0; i < nodes.size() - 1; i++) {
                for (String u : graph.keySet()) {
                    double du = dist.get(u);
                    if (du == Double.MAX_VALUE) continue;
                    for (String[] nb : graph.get(u)) {
                        String v = nb[0];
                        double w = Double.parseDouble(nb[1]);
                        double nd = du + w;
                        if (nd < dist.getOrDefault(v, Double.MAX_VALUE)) {
                            dist.put(v, nd);
                        }
                    }
                }
            }
            return dist;
        }

        static double[][] floydWarshall(double[][] mat) {
            int n = mat.length;
            double[][] d = new double[n][n];
            for (int i = 0; i < n; i++) {
                System.arraycopy(mat[i], 0, d[i], 0, n);
            }
            for (int k = 0; k < n; k++) {
                for (int i = 0; i < n; i++) {
                    for (int j = 0; j < n; j++) {
                        if (d[i][k] + d[k][j] < d[i][j]) {
                            d[i][j] = d[i][k] + d[k][j];
                        }
                    }
                }
            }
            return d;
        }

        static List<String> topologicalSort(Map<String, List<String>> dag, List<String> nodes) {
            Map<String, Integer> inDeg = new HashMap<>();
            for (String n : nodes) inDeg.put(n, 0);
            for (String u : dag.keySet()) {
                for (String v : dag.get(u)) {
                    inDeg.merge(v, 1, Integer::sum);
                }
            }

            Queue<String> q = new LinkedList<>();
            for (String n : nodes) {
                if (inDeg.get(n) == 0) q.add(n);
            }

            List<String> order = new ArrayList<>();
            while (!q.isEmpty()) {
                String u = q.poll();
                order.add(u);
                for (String v : dag.getOrDefault(u, Collections.emptyList())) {
                    inDeg.merge(v, -1, Integer::sum);
                    if (inDeg.get(v) == 0) q.add(v);
                }
            }
            return order;
        }
    }

    // ===================== M5: Sorting =====================

    static class FlightSorter {

        static void mergeSort(List<Flight> arr, int l, int r, Comparator<Flight> cmp) {
            if (l >= r) return;
            int m = (l + r) / 2;
            mergeSort(arr, l, m, cmp);
            mergeSort(arr, m + 1, r, cmp);
            List<Flight> tmp = new ArrayList<>();
            int i = l, j = m + 1;
            while (i <= m && j <= r) {
                if (cmp.compare(arr.get(i), arr.get(j)) <= 0) tmp.add(arr.get(i++));
                else tmp.add(arr.get(j++));
            }
            while (i <= m) tmp.add(arr.get(i++));
            while (j <= r) tmp.add(arr.get(j++));
            for (int k = 0; k < tmp.size(); k++) arr.set(l + k, tmp.get(k));
        }

        static void quickSort(List<Flight> arr, int lo, int hi, Comparator<Flight> cmp) {
            if (lo >= hi) return;
            Flight pivot = arr.get(hi);
            int i = lo - 1;
            for (int j = lo; j < hi; j++) {
                if (cmp.compare(arr.get(j), pivot) <= 0) {
                    i++;
                    Collections.swap(arr, i, j);
                }
            }
            Collections.swap(arr, i + 1, hi);
            int p = i + 1;
            quickSort(arr, lo, p - 1, cmp);
            quickSort(arr, p + 1, hi, cmp);
        }

        static void heapSort(List<Flight> arr, Comparator<Flight> cmp) {
            int n = arr.size();
            for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i, cmp);
            for (int i = n - 1; i > 0; i--) {
                Collections.swap(arr, 0, i);
                heapify(arr, i, 0, cmp);
            }
        }

        private static void heapify(List<Flight> arr, int n, int i, Comparator<Flight> cmp) {
            int largest = i, l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && cmp.compare(arr.get(l), arr.get(largest)) > 0) largest = l;
            if (r < n && cmp.compare(arr.get(r), arr.get(largest)) > 0) largest = r;
            if (largest != i) {
                Collections.swap(arr, i, largest);
                heapify(arr, n, largest, cmp);
            }
        }

        static List<Integer> countingSort(List<Integer> tickets) {
            int max = Collections.max(tickets);
            int[] cnt = new int[max + 1];
            for (int t : tickets) cnt[t]++;
            List<Integer> sorted = new ArrayList<>();
            for (int i = 0; i <= max; i++) {
                while (cnt[i]-- > 0) sorted.add(i);
            }
            return sorted;
        }

        static List<Integer> radixSort(List<Integer> arr) {
            int max = Collections.max(arr);
            List<Integer> res = new ArrayList<>(arr);
            for (int exp = 1; max / exp > 0; exp *= 10) countingSortByDigit(res, exp);
            return res;
        }

        private static void countingSortByDigit(List<Integer> arr, int exp) {
            int n = arr.size();
            int[] out = new int[n];
            int[] cnt = new int[10];
            for (int x : arr) cnt[(x / exp) % 10]++;
            for (int i = 1; i < 10; i++) cnt[i] += cnt[i - 1];
            for (int i = n - 1; i >= 0; i--) {
                int x = arr.get(i);
                int dig = (x / exp) % 10;
                out[--cnt[dig]] = x;
            }
            for (int i = 0; i < n; i++) arr.set(i, out[i]);
        }
    }

    // ===================== M6: Greedy & DP =====================

    static class OptimizationEngine {

        static List<int[]> activitySelection(int[][] activities) {
            Arrays.sort(activities, Comparator.comparingInt(a -> a[1]));
            List<int[]> selected = new ArrayList<>();
            int lastEnd = -1;
            for (int[] act : activities) {
                if (act[0] >= lastEnd) {
                    selected.add(act);
                    lastEnd = act[1];
                }
            }
            return selected;
        }

        static double fractionalKnapsack(List<CargoItem> items, int capacity) {
            items.sort((a, b) -> Double.compare(b.value / b.weight, a.value / a.weight));
            double total = 0;
            int rem = capacity;
            for (CargoItem item : items) {
                if (rem <= 0) break;
                int take = Math.min(item.weight, rem);
                total += take * (item.value / item.weight);
                rem -= take;
            }
            return total;
        }

        static double zeroOneKnapsack(List<CargoItem> items, int capacity) {
            int n = items.size();
            double[][] dp = new double[n + 1][capacity + 1];
            for (int i = 1; i <= n; i++) {
                CargoItem item = items.get(i - 1);
                for (int w = 0; w <= capacity; w++) {
                    dp[i][w] = dp[i - 1][w];
                    if (item.weight <= w) {
                        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - item.weight] + item.value);
                    }
                }
            }
            return dp[n][capacity];
        }

        static int lis(int[] arr) {
            int n = arr.length;
            int[] dp = new int[n];
            Arrays.fill(dp, 1);
            for (int i = 1; i < n; i++) {
                for (int j = 0; j < i; j++) {
                    if (arr[j] < arr[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            int max = 0;
            for (int x : dp) max = Math.max(max, x);
            return max;
        }
    }

    // ===================== SHARED SAMPLE DATA =====================

    private static List<Flight> sampleFlights;
    private static Flight f1, f2, f3;
    private static int[] paxByHour;
    private static AirportGraph airportGraph;
    private static Map<String, List<String[]>> weightedGraph;
    private static double[][] fwMatrix;
    private static Map<String, List<String>> dagForTopo;
    private static List<CargoItem> sampleCargo;
    private static int[][] gateActivities;
    private static int[] trafficGrowth;

    private static void initSampleData() {
        f1 = new Flight("FL100", "NYC", "LAX", "Capt. Miller",
                800, 0, 178, 180, 350.0);
        f2 = new Flight("FL200", "LAX", "ORD", "Capt. Smith",
                1000, 10, 215, 220, 280.0);
        f3 = new Flight("FL050", "ORD", "MIA", "Capt. Johnson",
                600, 5, 148, 150, 200.0);

        sampleFlights = new ArrayList<>();
        sampleFlights.add(new Flight("FL300", "DXB", "LHR", "Capt. Ahmed",
                900, 15, 95, 100, 400));
        sampleFlights.add(new Flight("FL010", "DEL", "BLR", "Capt. Rao",
                700, 2, 190, 200, 150));
        sampleFlights.add(new Flight("FL150", "ZRH", "CDG", "Capt. Laurent",
                500, 30, 48, 50, 250));

        paxByHour = new int[]{10, 40, 80, 200, 150, 90, 300, 250, 100, 60};

        airportGraph = new AirportGraph();
        airportGraph.addRoute("NYC", "LAX", 5);
        airportGraph.addRoute("NYC", "ORD", 2);
        airportGraph.addRoute("LAX", "MIA", 4);
        airportGraph.addRoute("ORD", "MIA", 3);

        weightedGraph = new HashMap<>();
        weightedGraph.put("NYC", Arrays.asList(new String[]{"LAX", "5"}, new String[]{"ORD", "2"}));
        weightedGraph.put("LAX", Collections.singletonList(new String[]{"MIA", "4"}));
        weightedGraph.put("ORD", Collections.singletonList(new String[]{"MIA", "3"}));
        weightedGraph.put("MIA", new ArrayList<>());

        double INF = Double.MAX_VALUE / 2;
        fwMatrix = new double[][]{
                {0, 5, 2, INF},
                {INF, 0, INF, 4},
                {INF, INF, 0, 3},
                {INF, INF, INF, 0}
        };

        dagForTopo = new HashMap<>();
        dagForTopo.put("Checkin", Arrays.asList("Security"));
        dagForTopo.put("Security", Arrays.asList("Gate", "Lounge"));
        dagForTopo.put("Gate", Arrays.asList("Boarding"));
        dagForTopo.put("Lounge", Arrays.asList("Boarding"));
        dagForTopo.put("Boarding", new ArrayList<>());

        sampleCargo = new ArrayList<>();
        sampleCargo.add(new CargoItem("Electronics", 20, 600));
        sampleCargo.add(new CargoItem("Clothes", 30, 450));
        sampleCargo.add(new CargoItem("Medicine", 10, 400));

        gateActivities = new int[][]{
                {0, 2},
                {1, 4},
                {3, 5},
                {4, 7},
                {6, 9}
        };

        trafficGrowth = new int[]{100, 120, 110, 150, 145, 180, 200, 195, 220};
    }

    // ===================== MENU ACTIONS (DOMAIN-FOCUSED OUTPUT) =====================

    private static void printFlights(List<Flight> flights) {
        for (Flight f : flights) {
            System.out.println("  - " + f);
        }
    }

    private static void runOverview() {
        System.out.println("\n=== Overview ===");
        System.out.println("AirLink simulates a small airline control center:");
        System.out.println("• Tracks flights with captain, capacity, passengers, delays and ticket prices");
        System.out.println("• Monitors passenger load per hour on the network");
        System.out.println("• Manages airport connections and computes optimal routes and schedules");
        System.out.println("Concept used here: High-level system design description (no specific DS/Algo).");
    }

    private static void runFlightTrees() {
        System.out.println("\n=== Flight Registry (BST & AVL) ===");

        FlightBST bst = new FlightBST();
        bst.insert(f1);
        bst.insert(f2);
        bst.insert(f3);

        System.out.println("All scheduled flights (ordered by Flight ID using BST):");
        List<Flight> bstFlights = bst.getSortedFlights();
        printFlights(bstFlights);
        System.out.println("\nLooking up a specific flight by ID (FL200) using BST:");
        Flight found = bst.search("FL200");
        System.out.println(found != null ? "  Found: " + found : "  Flight FL200 not found");

        AVLTree avl = new AVLTree();
        avl.insert(f1);
        avl.insert(f2);
        avl.insert(f3);
        System.out.println("\nBalanced view of same registry (AVL Tree keeps tree height minimal):");
        printFlights(avl.getSortedFlights());

        System.out.println("\nConcept used in this section: Binary Search Tree (BST) and AVL Tree (self-balancing BST).");
    }

    private static void runAdvancedTrees() {
        System.out.println("\n=== Departure Time Index & Passenger Load ===");

        BPlusTree bpt = new BPlusTree();
        bpt.insert(f1);
        bpt.insert(f2);
        bpt.insert(f3);

        System.out.println("Flights indexed by departure time (B+ Tree leaf node):");
        System.out.println("  Query flights departing between 600 and 900:");
        List<Flight> range = bpt.rangeQuery(600, 900);
        printFlights(range);

        SegmentTree seg = new SegmentTree(paxByHour);
        int segSum = seg.query(2, 6);
        System.out.println("\nPassenger volume on network (Segment Tree over per-hour counts):");
        System.out.println("  Hours 0-9 passenger counts: " + Arrays.toString(paxByHour));
        System.out.println("  Total passengers from hour index 2 to 6: " + segSum);

        FenwickTree fen = new FenwickTree(paxByHour.length);
        for (int i = 0; i < paxByHour.length; i++) fen.update(i, paxByHour[i]);
        int fenSum = fen.rangeQuery(0, 5);
        System.out.println("\nFenwick Tree for fast cumulative passenger queries:");
        System.out.println("  Cumulative passengers from hour index 0 to 5: " + fenSum);

        System.out.println("\nConcept used in this section: B+ Tree (indexed by departure time), Segment Tree & Fenwick Tree (range sum queries).");
    }

    private static void runGraphOperations() {
        System.out.println("\n=== Airport Network (BFS, DFS, MST) ===");

        System.out.println("Airports in network and connectivity:");
        System.out.println("  NYC: connects to LAX (5 units), ORD (2 units)");
        System.out.println("  LAX: connects to NYC, MIA");
        System.out.println("  ORD: connects to NYC, MIA");
        System.out.println("  MIA: connects to LAX, ORD");

        System.out.println("\nExploring reachable airports from NYC using BFS (level-order):");
        System.out.println("  Visit order: " + airportGraph.bfs("NYC"));

        System.out.println("\nExploring the same network using DFS (depth-first):");
        System.out.println("  Visit order: " + airportGraph.dfs("NYC"));

        System.out.println("\nConstructing a minimum-cost backbone of the network (MST using Kruskal):");
        List<String[]> mst = airportGraph.kruskalMST();
        int total = 0;
        for (String[] e : mst) {
            int w = Integer.parseInt(e[2]);
            total += w;
            System.out.print("  Edge: " + e[0] + " - " + e[1] + " (cost " + w + ")\n");
        }
        System.out.println("  Total cost of MST: " + total);

        System.out.println("\nConcept used in this section: Graph (Adjacency List) with BFS, DFS and Kruskal’s Minimum Spanning Tree.");
    }

    private static void runShortestPaths() {
        System.out.println("\n=== Route Optimization (Shortest Paths) ===");

        System.out.println("We compute shortest travel costs from NYC to all other airports:");

        Map<String, Double> dijkstraDist = ShortestPath.dijkstra(weightedGraph, "NYC");
        System.out.println("\nUsing Dijkstra (no negative edges, greedy):");
        for (Map.Entry<String, Double> e : dijkstraDist.entrySet()) {
            System.out.println("  NYC -> " + e.getKey() + " : " + e.getValue());
        }

        Map<String, Double> bfDist = ShortestPath.bellmanFord(
                weightedGraph, "NYC", Arrays.asList("NYC", "LAX", "ORD", "MIA"));
        System.out.println("\nUsing Bellman–Ford (handles negative weights conceptually):");
        for (Map.Entry<String, Double> e : bfDist.entrySet()) {
            System.out.println("  NYC -> " + e.getKey() + " : " + e.getValue());
        }

        double[][] fw = ShortestPath.floydWarshall(fwMatrix);
        System.out.println("\nUsing Floyd–Warshall (all-pairs shortest paths on small network):");
        System.out.println("  Example cost from node 0 (NYC) to node 3 (MIA): " + fw[0][3]);

        List<String> topo = ShortestPath.topologicalSort(
                dagForTopo,
                Arrays.asList("Checkin", "Security", "Gate", "Lounge", "Boarding"));
        System.out.println("\nPassenger processing pipeline within an airport:");
        System.out.println("  Stages: Checkin -> Security -> Gate/Lounge -> Boarding");
        System.out.println("  Valid processing order (Topological Sort): " + topo);

        System.out.println("\nConcept used in this section: Dijkstra, Bellman–Ford, Floyd–Warshall, and Topological Sort on a DAG.");
    }

    private static void runSortingAlgorithms(Scanner scanner) {
        System.out.println("\n=== Flight Listings & Ticket Sorting ===");

        boolean back = false;
        while (!back) {
            System.out.println("\nSorting Menu:");
            System.out.println("1. List flights ordered by departure time (Merge Sort)");
            System.out.println("2. List flights ordered by delay (Quick Sort)");
            System.out.println("3. List flights ordered by passenger load (Heap Sort)");
            System.out.println("4. Sort ticket numbers using Counting Sort");
            System.out.println("5. Sort ticket numbers using Radix Sort");
            System.out.println("0. Back to main menu");
            System.out.print("Enter your choice: ");

            int choice = readInt(scanner);
            switch (choice) {
                case 1: {
                    List<Flight> byDep = new ArrayList<>(sampleFlights);
                    FlightSorter.mergeSort(byDep, 0, byDep.size() - 1,
                            Comparator.comparingInt(f -> f.departureTime));
                    System.out.println("\nFlights ordered by departure time:");
                    printFlights(byDep);
                    System.out.println("Concept used: Merge Sort on list of flights.");
                    break;
                }
                case 2: {
                    List<Flight> byDelay = new ArrayList<>(sampleFlights);
                    FlightSorter.quickSort(byDelay, 0, byDelay.size() - 1,
                            Comparator.comparingInt(f -> f.delay));
                    System.out.println("\nFlights ordered by delay (most punctual first):");
                    printFlights(byDelay);
                    System.out.println("Concept used: Quick Sort on list of flights.");
                    break;
                }
                case 3: {
                    List<Flight> byPax = new ArrayList<>(sampleFlights);
                    FlightSorter.heapSort(byPax, Comparator.comparingInt(f -> f.passengers));
                    System.out.println("\nFlights ordered by passengers onboard:");
                    printFlights(byPax);
                    System.out.println("Concept used: Heap Sort on list of flights.");
                    break;
                }
                case 4: {
                    List<Integer> tickets = Arrays.asList(412, 203, 105, 330, 218);
                    System.out.println("\nTicket numbers before Counting Sort: " + tickets);
                    System.out.println("Ticket numbers after Counting Sort : " +
                            FlightSorter.countingSort(tickets));
                    System.out.println("Concept used: Counting Sort on integer ticket numbers.");
                    break;
                }
                case 5: {
                    List<Integer> tickets = Arrays.asList(412, 203, 105, 330, 218);
                    System.out.println("\nTicket numbers before Radix Sort: " + tickets);
                    System.out.println("Ticket numbers after Radix Sort : " +
                            FlightSorter.radixSort(new ArrayList<>(tickets)));
                    System.out.println("Concept used: Radix Sort (LSD) on integer ticket numbers.");
                    break;
                }
                case 0:
                    back = true;
                    break;
                default:
                    System.out.println("Invalid choice. Please choose a valid option.");
            }
        }
    }

    private static void runOptimization() {
        System.out.println("\n=== Gate Scheduling, Cargo Planning & Traffic Trends ===");

        System.out.println("Gate time windows (start,end):");
        for (int[] g : gateActivities) {
            System.out.println("  Gate usage window: [" + g[0] + "," + g[1] + "]");
        }
        List<int[]> selected = OptimizationEngine.activitySelection(gateActivities);
        System.out.println("\nSelected non-overlapping gate usage slots (maximize gate utilization):");
        for (int[] a : selected) {
            System.out.println("  Selected window: [" + a[0] + "," + a[1] + "]");
        }
        System.out.println("Concept used: Activity Selection (Greedy interval scheduling).");

        System.out.println("\nCargo options available for a flight:");
        for (CargoItem c : sampleCargo) {
            System.out.println("  - " + c);
        }
        System.out.println("Maximum cargo value with capacity 40 (fractional loading allowed):");
        System.out.println("  Value = " +
                OptimizationEngine.fractionalKnapsack(new ArrayList<>(sampleCargo), 40));
        System.out.println("Concept used: Fractional Knapsack (Greedy by value/weight).");

        System.out.println("\nIf cargo cannot be split (0/1 Knapsack) with capacity 40:");
        System.out.println("  Max value = " +
                OptimizationEngine.zeroOneKnapsack(sampleCargo, 40));
        System.out.println("Concept used: 0/1 Knapsack (Dynamic Programming).");

        System.out.println("\nPassenger traffic by month (example sequence):");
        System.out.println("  " + Arrays.toString(trafficGrowth));
        System.out.println("Length of longest increasing trend in traffic:");
        System.out.println("  LIS length = " + OptimizationEngine.lis(trafficGrowth));
        System.out.println("Concept used: Longest Increasing Subsequence (Dynamic Programming).");
    }

    // ===================== MENU & INPUT HELPERS =====================

    private static int readInt(Scanner scanner) {
        while (true) {
            String line = scanner.nextLine().trim();
            if (line.isEmpty()) {
                System.out.print("Please enter a number: ");
                continue;
            }
            try {
                return Integer.parseInt(line);
            } catch (NumberFormatException e) {
                System.out.print("Invalid input. Please enter a valid integer: ");
            }
        }
    }

    private static void printMainMenu() {
        System.out.println("\n==================== AirLink Control Center ====================");
        System.out.println("1. Overview");
        System.out.println("2. Flight Trees (Registry by ID)");
        System.out.println("3. Advanced Trees (Departure & Passenger Loads)");
        System.out.println("4. Airport Network (Graph Operations)");
        System.out.println("5. Route Optimization (Shortest Paths)");
        System.out.println("6. Flight Listings & Ticket Sorting");
        System.out.println("7. Gate & Cargo Optimization (Greedy & DP)");
        System.out.println("0. Exit");
        System.out.print("Select an option: ");
    }

    // ===================== MAIN =====================

    public static void main(String[] args) {
        initSampleData();
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        while (running) {
            printMainMenu();
            int choice = readInt(scanner);
            switch (choice) {
                case 1:
                    runOverview();
                    break;
                case 2:
                    runFlightTrees();
                    break;
                case 3:
                    runAdvancedTrees();
                    break;
                case 4:
                    runGraphOperations();
                    break;
                case 5:
                    runShortestPaths();
                    break;
                case 6:
                    runSortingAlgorithms(scanner);
                    break;
                case 7:
                    runOptimization();
                    break;
                case 0:
                    System.out.println("Exiting AirLink. Goodbye.");
                    running = false;
                    break;
                default:
                    System.out.println("Invalid choice. Please select a valid option from the menu.");
            }
        }

        scanner.close();
    }
}