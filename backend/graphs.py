import networkx as nx
import plotly.graph_objs as go
import io
import plotly.express as px
from pymongo import MongoClient
import pandas as pd

client = MongoClient('mongodb://localhost:27017/')
db = client['fcRecog']  # 
collection = db['estudiantes']  # 

def fetch_data_from_mongodb():
    # Fetch data from MongoDB
    data = list(collection.find({}, {'_id': 0, 'nombre_del_alumno': 1,'matricula': 1, 'clase': 1, 'asistencias': 1, 'participaciones': 1}))

    # Convert data to a Pandas DataFrame
    df = pd.DataFrame(data)
    df['clase'] = df['clase'].astype('category')

    return df

def generate_random_graph():
    # Generate a random graph
    graph = nx.fast_gnp_random_graph(10, 0.3)

    # Convert the graph to a dictionary representation
    graph_dict = nx.readwrite.json_graph.node_link_data(graph)

    # Create a Plotly figure
    pos = nx.spring_layout(graph)
    edge_trace = go.Scatter(
        x=[],
        y=[],
        line=dict(width=0.5, color='#888'),
        hoverinfo='none',
        mode='lines')

    for edge in graph.edges():
        x0, y0 = pos[edge[0]]
        x1, y1 = pos[edge[1]]
        edge_trace['x'] += tuple([x0, x1, None])
        edge_trace['y'] += tuple([y0, y1, None])

    node_trace = go.Scatter(
        x=[],
        y=[],
        text=[],
        mode='markers',
        hoverinfo='text',
        marker=dict(
            showscale=True,
            colorscale='YlGnBu',
            size=10,
            colorbar=dict(
                thickness=15,
                title='Node Connections',
                xanchor='left',
                titleside='right'
            )
        )
    )

    for node in graph.nodes():
        x, y = pos[node]
        node_trace['x'] += tuple([x])
        node_trace['y'] += tuple([y])

    # Create the Plotly layout
    layout = go.Layout(
        showlegend=False,
        hovermode='closest',
        margin=dict(b=0, l=0, r=0, t=0)
    )

    # Create the Plotly figure
    fig = go.Figure(data=[edge_trace, node_trace], layout=layout)

    # Save the figure as an image without displaying it
    image_stream = io.BytesIO()
    fig.write_image(image_stream, format='png')

    return graph_dict, image_stream

def generate_heatmap():
    # Fetch data from MongoDB
    df = fetch_data_from_mongodb()

    # Group data by class and calculate mean attendance and participations
    class_stats = df.groupby('clase').agg({'asistencias': 'mean', 'participaciones': 'mean'}).reset_index()

    # Create a heatmap using Plotly Express
    fig = px.imshow(class_stats[['asistencias', 'participaciones']],
                    labels=dict(color='Nivel de Compromiso'),
                    x=['asistencias', 'participaciones'],
                    y=class_stats['clase'],
                    color_continuous_scale='YlGnBu',
                    title='Nivel de compromiso por clase')
    

    # Save the figure as an image without displaying it
    image_stream = io.BytesIO()
    fig.write_image(image_stream, format='png')

    # Convert the graph to a dictionary representation
    graph_dict = generate_random_graph()[0]  # Assuming generate_random_graph() returns a tuple (graph_dict, _)

    return graph_dict, image_stream

def generate_bubble_chart():
    # Fetch data from MongoDB
    df = fetch_data_from_mongodb()

    # Create a bubble chart using Plotly Express
    fig = px.scatter(df, x='asistencias', y='participaciones', size='participaciones',
                     color='clase', hover_name='nombre_del_alumno',
                     labels={'asistencias': 'Asistencia', 'participaciones': 'Participacion'},
                     size_max=30, title='Participacion vs Asistencia')

    # Save the figure as an image without displaying it
    image_stream = io.BytesIO()
    fig.write_image(image_stream, format='png')

    # Convert the graph to a dictionary representation
    graph_dict = generate_random_graph()[0]  # Assuming generate_random_graph() returns a tuple (graph_dict, _)
    return graph_dict, image_stream

def generate_pie_chart():
    # Fetch data from MongoDB
    df = fetch_data_from_mongodb()

    # Count the number of students in each class
    class_distribution = df['clase'].value_counts().reset_index()
    class_distribution.columns = ['clase', 'count']  
    # Create a pie chart using Plotly Express
    fig = px.pie(class_distribution, names='clase', values='count',
                 title='Distribucion de clases',
                 labels={'clase': 'Class', 'count': 'Number of Students'},
                 template='seaborn')
    

    # Save the figure as an image without displaying it
    image_stream = io.BytesIO()
    fig.write_image(image_stream, format='png')

    # Convert the graph to a dictionary representation
    graph_dict = generate_random_graph()[0]  # Assuming generate_random_graph() returns a tuple (graph_dict, _)

    return graph_dict, image_stream

def generate_class_specific_bar_chart(class_name):
    data = fetch_data_from_mongodb()  
    df = pd.DataFrame(data)

    # Filter the DataFrame based on the provided class_name
    class_data = df[df['clase'] == class_name]

    if class_data.empty:
        raise ValueError(f"No data found for class: {class_name}")

    avg_attendance = class_data['asistencias'].mean()
    avg_participations = class_data['participaciones'].mean()

    # Create a bar chart using Plotly Express
    fig = px.bar(x=['Asistencias promedio', 'Participaciones promedio'], y=[avg_attendance, avg_participations],
                 labels={'y': 'Promedio'},
                 title=f'{class_name} - Participaciones y asistencias promedio')

    # Save the figure as an image without displaying it
    image_stream = io.BytesIO()
    fig.write_image(image_stream, format='png')

    # Convert the graph to a dictionary representation
    graph_dict = fig.to_dict()

    return graph_dict, image_stream

def generate_class_participation_box_plot(class_name):
    data = fetch_data_from_mongodb()  
    df = pd.DataFrame(data)

    # Filter the DataFrame based on the provided class_name
    class_data = df[df['clase'] == class_name]

    if class_data.empty:
        raise ValueError(f"No data found for class: {class_name}")

    # Create a box plot for class attendance distribution
    fig = px.box(class_data, y='participaciones', title=f'{class_name} - Distribucion de participaciones en la clase',
                 labels={'participaciones': 'Participaciones'})

    # Save the figure as an image without displaying it
    image_stream = io.BytesIO()
    fig.write_image(image_stream, format='png')

    # Convert the graph to a dictionary representation
    graph_dict = fig.to_dict()

    return graph_dict, image_stream

def generate_student_attendance_bar_chart(student_name):
    data = fetch_data_from_mongodb()  
    df = pd.DataFrame(data)

    # Filter the DataFrame based on the provided student_name
    student_data = df[df['nombre_del_alumno'] == student_name]

    if student_data.empty:
        raise ValueError(f"No data found for student: {student_name}")

    # Extract attendance and participations for the student
    attendance = student_data['asistencias'].values[0]
    participations = student_data['participaciones'].values[0]

    # Create a bar chart for student attendance and participations
    fig = px.bar(x=['Asistencias', 'Participaciones'], y=[attendance, participations],
                 labels={'y': 'Conteo'},
                 title=f'{student_name} - Participaciones y Asistencia')

    # Remove x-axis label
    fig.update_layout(xaxis_title='')

    # Save the figure as an image without displaying it
    image_stream = io.BytesIO()
    fig.write_image(image_stream, format='png')

    # Convert the graph to a dictionary representation
    graph_dict = fig.to_dict()

    return graph_dict, image_stream

def generate_student_ranking_bar_graph(student_name):
    data = fetch_data_from_mongodb()  
    df = pd.DataFrame(data)

    # Filter the DataFrame based on the provided student_name
    student_data = df[df['nombre_del_alumno'] == student_name]

    if student_data.empty:
        raise ValueError(f"No data found for student: {student_name}")

    # Extract attendance and participations for the student
    attendance = student_data['asistencias'].values[0]
    participations = student_data['participaciones'].values[0]

    # Calculate the student's ranking based on participations
    df_sorted = df.sort_values(by='participaciones', ascending=False)
    student_rank = df_sorted.index.get_loc(student_data.index[0]) + 1  # Adding 1 to start ranking from 1

    # Get the two students ahead and the two students behind
    students_ahead = df_sorted.iloc[max(0, student_rank - 2):max(0, student_rank)]
    students_behind = df_sorted.iloc[student_rank:min(len(df_sorted), student_rank + 2)]

    # Combine the students for the graph
    selected_students = pd.concat([students_ahead, student_data, students_behind])

    # Create a bar graph using Plotly Express
    fig = px.bar(selected_students, x='nombre_del_alumno', y=['asistencias', 'participaciones'],
                 title=f'{student_name} - Eres el #{student_rank} en mayores participaciones',
                 labels={'value': 'Conteo', 'variable': 'Metrica'},
                 barmode='group',)

    # Save the figure as an image without displaying it
    image_stream = io.BytesIO()
    fig.write_image(image_stream, format='png')

    # Convert the graph to a dictionary representation
    graph_dict = fig.to_dict()

    return graph_dict, image_stream

if __name__ == "__main__":
    generate_heatmap()
    print("ok boomer")